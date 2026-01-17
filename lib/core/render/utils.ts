import type { Attribute, RenderState } from '#lib/core/render/types';
import { Component } from '#lib/core/components/class';
import { MarkupRenderer } from '#lib/core/markup/class';
import type { XmlParserElementNode } from 'xml-parser-xo';

/** Wraps HTML in a `<slyde-component>` This is to make it easier for us to select elements. */
export const wrapper = function wrapper(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  component: Component.Interface,
  state: RenderState,
  children: string
): string {
  let width = '';
  if (component.width ?? '') width = `width:calc(${component.width} * var(--unit));`;

  let height = '';
  if (component.height ?? '') height = `height:calc(${component.height} * var(--unit));`;

  // eslint-disable-next-line no-inline-comments
  return /*HTML*/ `
    <slyde-component name="${component.name}" 
      style="${width}display:${component.display};${height}"
      path="${component.path}" 
      id="slyde-component-container-${component.id}" 
      markup="${state.markup}"
      level="${state.level}"
    >
      <!-- ${state.notes.join('\n\n')} -->
      ${children}
    </slyde-component>
  `;
};

/**
 * Gets the attribute value pairs from an XML like string. For example
 *
 * ```
 * attr="3" enabled attr2="b"
 * ```
 *
 * becomes the following (YAML) object:
 *
 * ```YAML
 * - name: "attr"
 *   value: "3"
 * - name: "enabled"
 *   value: ""
 * - name: "attr2"
 *   value: "b"
 * ```
 */
export const getAttributes = function getAttributes(str: string): Attribute[] {
  const stripQuotes = function stripQuotes(val: string): string {
    return val.replace(/^['"]|['"]$/giu, '');
  };

  // Match both attributes with values (name="value") and without (name)
  const regex = /(?<name>[^\s=]+)(?:\s*=\s*(?<value>"[^"]*"|'[^']*'|[^\s>]+))?/giu;
  const results: Attribute[] = [];

  let match; // eslint-disable-line @typescript-eslint/init-declarations
  while ((match = regex.exec(str)) !== null && match.groups) {
    let value = '';
    if (match.groups.value) {
      value = stripQuotes(match.groups.value.trim());
    }

    results.push({ name: match.groups.name.trim(), value });
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
  state: RenderState
): Component.Instance {
  const ComponentInstance = Component.retrieve(element.name);
  if (!ComponentInstance) {
    throw new Error(
      `No such ${Component.name}: ${element.name} at ${state.path}. (Did you load the plugin?)`
    );
  }

  return new ComponentInstance({
    ...state,
    attributes: { ...element.attributes },
    focusMode: 'default',
    id: state.id.toString(),
  });
};
