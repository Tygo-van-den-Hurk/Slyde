import type {
  XmlParserCommentNode,
  XmlParserElementNode,
  XmlParserProcessingInstructionNode,
  XmlParserResult,
  XmlParserTextNode,
} from 'xml-parser-xo';
import { Component } from '#lib/core/components/class';
import { Logger } from '#lib/logger';
import { MarkupRenderer } from '#lib/core/markup/class';
import pkg from '#package' with { type: 'json' };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Types ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/** The general rendering state. */
interface State {
  path: readonly string[];
  level: number;
  index: number;
  id: number;
  markup: string;
}

/** An XML attribute pair. */
interface Attribute {
  /** The name of the attribute */
  name: string;
  /** The value of the attribute */
  value: string;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/**
 * Gets the attribute value pairs from an XML like string. For example `attr="3" x attr2="b"` becomes:
 *
 * ```JSON
 * [ { "name": "attr", "value": "3" }, { "name": "attr2", "value": "b" } ]
 * ```
 */
export const getAttributes = function getAttributes(str: string): Attribute[] {
  const stripQuotes = function stripQuotes(val: string): string {
    return val.replace(/^['"]|['"]$/giu, '');
  };

  const regex = /(?<name>[^\s=]+)\s*=\s*(?<value>"[^"]*"|'[^']*'|[^\s>]+)\s*/giu;
  const results: Attribute[] = [];

  let match; // eslint-disable-line @typescript-eslint/init-declarations
  while ((match = regex.exec(str)) !== null && match.groups) {
    results.push({
      name: match.groups.name.trim(),
      value: stripQuotes(match.groups.value.trim()),
    });
  }

  return results;
};

/** Get a `MarkupRenderer` by name or throw if it does not exist. */
export const getMarkupRenderer = function getMarkupRenderer(name: string): MarkupRenderer.Instance {
  const MarkupRendererInstance = MarkupRenderer.retrieve(name);
  if (MarkupRendererInstance) return new MarkupRendererInstance();
  throw new Error(
    `A markup language "${name}" was requested, but no such renderer was installed. ` +
      '(Did you load the plugin?)'
  );
};

/** Creates a component instance from an `XmlParserElementNode` by name and attributes. */
export const createComponentInstance = function createComponentInstance(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  element: XmlParserElementNode,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): Component.Instance {
  const ComponentInstance = Component.retrieve(element.name);
  if (!ComponentInstance) {
    throw new Error(
      `No such ${Component.name}: ${element.name} at ${state.path.join('.')}. ` +
        `(Did you load the plugin?)`
    );
  }

  const instance = new ComponentInstance({
    attributes: { ...element.attributes },
    focusMode: 'default',
    id: state.id.toString(),
    level: state.level,
    path: [...state.path],
  });

  return instance;
};

/** Renders an XML comment element by looking up the current markup renderer, and then. */
export const useProcessingInstruction = function useProcessingInstruction(
  element: Readonly<XmlParserProcessingInstructionNode>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): State {
  state.path = [...state.path, `[${state.index}]-XML-PROCESSING-INSTRUCTION`];

  Logger.info(
    `Received new processing instruction '${element.content}' at ${state.path.join('.')}`
  );
  if (element.name === pkg.name) {
    const attributes = getAttributes(element.content);
    for (const attribute of attributes) {
      if (attribute.name === 'markup') state.markup = attribute.value;
      else
        Logger.warn(
          `Ignoring unknown processing instruction '${attribute.name}="${attribute.value}"' at ${state.path.join('.')}.`
        );
    }
  } else {
    Logger.warn(
      `Processing instruction ${state.path.join('.')} seems to be for ${element.name}, not ${pkg.name}. Ignoring instruction.`
    );
  }

  return state;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Render Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/** Renders an XML text element by looking up the current markup renderer, and then. */
export const renderText = function renderText(
  element: Readonly<XmlParserTextNode>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): string {
  state.path = [...state.path, `[${state.index}]-XML-TEXT`];
  Logger.debug(`Rendering ${element.type} at ${state.path.join('.')}`);
  const renderer = getMarkupRenderer(state.markup);
  return renderer.render(element.content);
};

/** Renders an XML comment element by looking up the current markup renderer, and then. */
export const renderComment = function renderComment(
  element: Readonly<XmlParserCommentNode>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): string {
  state.path = [...state.path, `[${state.index}]-XML-COMMENT`];
  Logger.debug(`Rendering ${element.type} at ${state.path.join('.')}`);
  const renderer = getMarkupRenderer(state.markup);
  return renderer.render(element.content);
};

/** Renders an XML element by looking up the component by name, and then rendering it. */
// eslint-disable-next-line max-lines-per-function, max-statements
export const renderElement = function renderElement(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  element: XmlParserElementNode,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): string {
  state.path = [...state.path, `[${state.index}]-${element.name}`];
  let thisState = { ...state };

  const instance = createComponentInstance(element, thisState);
  if (element.attributes.markup) thisState.markup = element.attributes.markup;

  const renderFunctions: (() => string)[] = [];
  for (const [index, child] of Array.from(element.children ?? []).entries()) {
    if (child.type === 'CDATA') renderFunctions.push(() => child.content);
    else if (child.type === 'ProcessingInstruction') {
      const path = [...thisState.path];
      thisState = useProcessingInstruction(child, {
        id: thisState.id + 1 + index,
        index,
        level: thisState.level + 1,
        markup: thisState.markup,
        path: [...thisState.path],
      });
      thisState.path = [...path];
    } else if (child.type === 'Element') {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      renderFunctions.push(() =>
        renderElement(child, {
          id: thisState.id + 1 + index,
          index,
          level: thisState.level + 1,
          markup: thisState.markup,
          path: [...thisState.path],
        })
      );
    } else if (child.type === 'Comment') {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      renderFunctions.push(() =>
        renderComment(child, {
          id: thisState.id + 1 + index,
          index,
          level: thisState.level + 1,
          markup: thisState.markup,
          path: [...thisState.path],
        })
      );
    } else {
      // If (child.type === 'Text')
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      renderFunctions.push(() =>
        renderText(child, {
          id: thisState.id + 1 + index,
          index,
          level: thisState.level + 1,
          markup: thisState.markup,
          path: [...thisState.path],
        })
      );
    }
  }

  let executed = false;
  let children: undefined | (() => string) = undefined; // eslint-disable-line no-undef-init, no-undefined
  if (renderFunctions.length === 0) executed = true;
  else {
    // eslint-disable-next-line func-name-matching
    children = function renderChildren(): string {
      executed = true;
      return renderFunctions.map((fn) => fn()).join('\n');
    };
  }

  Logger.debug(`Rendering ${element.name} at ${state.path.join('.')}`);

  // eslint-disable-next-line no-inline-comments
  const wrapper = (inner: string): string => /*HTML*/ `
    <slyde-component name="${element.name}" 
      path="${state.path.join('.')}" 
      id="slyde-component-container-${state.id}" 
      markup="${state.markup}"
      level="${state.level}"
    >
      ${inner}
    </slyde-component>
  `;

  const result = instance.render({ children });

  if (!executed)
    Logger.warn(`${Component.name} ${element.name} did not call to render it's children.`);

  if (state.level === 0) return result;
  return wrapper(result);
};

/**
 * Given an XML parser result, returns the rendered HTML.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const render = function render(tree: XmlParserResult): string {
  const level = Component.level.presentation;
  const id = 0;
  const markup = 'default';
  let state: State = { id, index: 0, level, markup, path: [] };
  for (const [index, child] of Array.from(tree.children).entries()) {
    if (child.type === 'DocumentType' && !child.content.includes(pkg.name)) {
      Logger.info(`Found Document type: '${child.content}' at ${index}-XML-DOCTYPE`);
      Logger.warn(
        `The DocumentType ${child.content} does not seem to include ${pkg.name}.` +
          `Are you sure this document is ment for me?`
      );
    } else if (child.type === 'ProcessingInstruction') {
      state = useProcessingInstruction(child, {
        ...state,
        index,
        path: [],
      });
    } else if (child.type === 'Element') {
      const result = renderElement(tree.root, {
        ...state,
        index,
        path: [],
      });
      Logger.info('Finished rendering');
      return result;
    }
  }

  throw new Error(
    `Did not find a single Element, only, Comments, Text, and pProcessing instructions, what is going on?` +
      'The XML parser should not have let you come this far without there being a single root element...?'
  );
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
