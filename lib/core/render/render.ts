import * as defaults from '#lib/core/defaults';
import { Globals, type RenderState } from '#lib/core/render/types';
import type {
  XmlParserCommentNode,
  XmlParserDocumentChildNode,
  XmlParserDocumentTypeNode,
  XmlParserElementNode,
  XmlParserResult,
  XmlParserTextNode,
} from 'xml-parser-xo';
import { createComponentInstance, getMarkupRenderer, wrapper } from '#lib/core/render/utils';
import { Component } from '#lib/core/components/class';
import { Logger } from '#lib/logger';
import { htmlDocument } from '#browser/html';
import { useProcessingInstruction } from '#lib/core/render/processing-instructions';

/** Handles an XML DocType in the document, by checking if the document mentions the compiler. */
export const handleDocType = function handleDocType(
  node: Readonly<XmlParserDocumentTypeNode>
): void {
  const slyde = 'slyde';
  if (!node.content.includes(slyde)) {
    Logger.warn(
      `DocType ${node.content} does not include "${slyde}", are you sure this is right document?`
    );
  }
};

/** Handles an XML comment in the document by adding it to the then visible notes. */
export const handleComment = function handleComment(
  startingState: RenderState,
  node: Readonly<XmlParserCommentNode>
): RenderState {
  const state = { ...startingState, path: `${startingState.path}/comment()` };
  Logger.debug(`Rendering ${node.type} at ${state.path}`);
  return {
    ...state,
    notes: [...state.notes, node.content],
  };
};

/** Renders an XML text element by looking up the current markup renderer, and then. */
export const renderText = async function renderText(
  startingState: RenderState,
  node: Readonly<XmlParserTextNode>
): Promise<string> {
  const state = { ...startingState, path: `${startingState.path}/text()` };
  const renderer = getMarkupRenderer(state.markup);
  return renderer.render(node.content);
};

/** Renders an XML element by looking up the current markup renderer, and then. */
export const renderElement = async function renderElement(
  startingState: RenderState,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  node: Readonly<XmlParserElementNode>,
  index: number
): Promise<string> {
  let suffix = '';
  if (index > 1) suffix = `[${index}]`;

  const state = { ...startingState, path: `${startingState.path}/${node.name}${suffix}` };
  Logger.debug(`Rendering ${node.type} at ${state.path}`);

  const component = createComponentInstance(node, state);

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const raw = await renderNode(node.children ?? [], { ...state, level: state.level + 1 });
  let executed = false;
  let children: undefined | (() => string) = undefined; // eslint-disable-line no-undef-init, no-undefined
  if (raw.length === 0) executed = true;
  else {
    // eslint-disable-next-line func-name-matching
    children = function renderChildren(): string {
      executed = true;
      return raw.join('');
    };
  }

  const result = await component.render({ children });
  if (!executed) Logger.warn(`${node.name} at ${state.path} did not call to render it's children.`);
  return wrapper(component, state, result);
};

const defaultState = (): RenderState => ({
  globals: Globals.instance,
  id: 0,
  level: Component.level.presentation,
  markup: 'default',
  notes: [],
  path: 'xpath:/',
});

/** Given an XML parser result, returns the rendered HTML. */
export const renderNode = async function renderNode(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  children: XmlParserDocumentChildNode[],
  startingState: RenderState = defaultState()
): Promise<readonly string[]> {
  const result = [] as Promise<string>[];
  let state = { ...startingState };

  const amount: Record<string, number | undefined> = {};

  for (const child of children) {
    // eslint-disable-next-line default-case
    switch (child.type) {
      case 'DocumentType':
        handleDocType(child);
        continue;
      case 'ProcessingInstruction':
        state = useProcessingInstruction(state, child);
        continue;
      case 'Comment':
        state = handleComment(state, child);
        continue;
      case 'Element':
        amount[child.name] = (amount[child.name] ?? 0) + 1;
        result.push(renderElement(state, child, amount[child.name] ?? 0));
        continue;
      case 'Text':
        result.push(renderText(state, child));
        continue;
      case 'CDATA':
        result.push(Promise.resolve(child.content));
        continue;
    }
  }

  return Promise.all(result);
};

/** Renders an XML document from the parser result. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, max-lines-per-function
export const render = async function render(input: XmlParserResult): Promise<string> {
  const context = {
    attributes: input.root.attributes,
    canBeAtLevel: (): boolean => true,
    focusMode: 'default',
    hierarchy: (): '*' => '*',
    id: '0',
    level: 0,
    name: input.root.name,
    path: `xpath://${input.root.name}`,
    render: (): string => '',
  } satisfies Component.Interface;

  const authors = Component.utils.extract({
    aliases: ['authors', 'author', 'by'],
    context,
    fallback: defaults.author,
    transform: (value) => value.split(',').map((author) => author.trim()),
  });

  const keywords = Component.utils.extract({
    aliases: ['keywords', 'tags'],
    context,
    fallback: defaults.keywords,
    transform: (value) => value.split(',').map((keyword) => keyword.trim()),
  });

  const icon = Component.utils.extract({
    aliases: ['icon'],
    context,
    fallback: defaults.icon,
  });

  const description = Component.utils.extract({
    aliases: ['description'],
    context,
    fallback: defaults.description,
  });

  const background = Component.utils.extract({
    aliases: ['background', 'background-color'],
    context,
    fallback: defaults.colors.background,
  });

  const foreground = Component.utils.extract({
    aliases: ['foreground', 'foreground-color'],
    context,
    fallback: defaults.colors.foreground,
  });

  const primary = Component.utils.extract({
    aliases: ['primary', 'primary-color'],
    context,
    fallback: defaults.colors.primary,
  });

  const secondary = Component.utils.extract({
    aliases: ['secondary', 'secondary-color'],
    context,
    fallback: defaults.colors.secondary,
  });

  const size = Component.utils.extract({
    aliases: ['size', 'dimensions'],
    context,
    fallback: `${defaults.size.width}x${defaults.size.height}`,
    transform: function transform(value) {
      const regex = /(?<width>\d+)x(?<height>\d+)/iu;
      const match = regex.exec(value);
      if (match?.groups) {
        const height = parseInt(match.groups.height, 10);
        const width = parseInt(match.groups.width, 10);
        return { height, width };
      }

      throw new Error(
        `Expected size property to be of the form ${regex}, but found "${value}" at //`
      );
    },
  });

  const nonce = Component.utils.extract({
    aliases: ['nonce'],
    context,
  });

  const result = await renderNode(input.children);
  const content = result.join('');
  return htmlDocument({
    ...defaults,
    authors,
    background,
    content,
    description,
    foreground,
    icon,
    keywords,
    nonce,
    primary,
    secondary,
    size,
  });
};
