import { Component, Point } from '#lib/core/components/index';
import { Globals, type RenderState } from '#lib/core/render/types';
import { MarkupRenderer, SlydeMarkupRenderer } from '#lib/core/markup/index';
import {
  createComponentInstance,
  getAttributes,
  getMarkupRenderer,
  wrapper,
} from '#lib/core/render/utils';
import { describe, expect, test } from 'vitest';
import type { XmlParserElementNode } from 'xml-parser-xo';

describe('function wrapper', () => {
  const node: XmlParserElementNode = {
    attributes: {},
    children: null,
    name: Point.name,
    type: 'Element',
  } satisfies XmlParserElementNode;

  const state: RenderState = {
    globals: Globals.instance,
    id: 0,
    level: Component.level.block,
    markup: SlydeMarkupRenderer.name,
    notes: [],
    /// TODO change later when we change the component interface to reflect the change
    path: ['test', 'path'] as unknown as string,
  } satisfies RenderState;

  const children = '<VERY-SPECIFIC-PATTERN>';

  test('extracting empty string', () => {
    const result = wrapper(node, state, children);
    expect(result).toContain(children);
  });
});

describe('function getAttributes', () => {
  test('extracting empty string', () => {
    const input = '';
    const result = getAttributes(input);
    expect(result.length).toBe(0);
  });

  test('extracting a single attribute', () => {
    const name = 'name';
    const value = 'value';
    const input = `${name}="${value}"`;
    const result = getAttributes(input);
    expect(result.length).toBe(1);
    expect(result[0]).toStrictEqual({ name, value });
  });

  test('extracting two attributes', () => {
    const name1 = 'name1';
    const value1 = 'value1';
    const name2 = 'name1';
    const value2 = 'value2';
    const input = `${name1}="${value1}" ${name2}="${value2}"`;
    const result = getAttributes(input);
    expect(result).toStrictEqual([
      { name: name1, value: value1 },
      { name: name2, value: value2 },
    ]);
  });

  test('extracting two attributes with a lot of space in between', () => {
    const name1 = 'name1';
    const value1 = 'value1';
    const name2 = 'name1';
    const value2 = 'value2';
    const input = `${name1}="${value1}"                ${name2}="${value2}"`;
    const result = getAttributes(input);
    expect(result).toStrictEqual([
      { name: name1, value: value1 },
      { name: name2, value: value2 },
    ]);
  });

  test('extracting unquoted values', () => {
    const name = 'name';
    const value = 'value';
    const input = `${name}=${value}`;
    const result = getAttributes(input);
    expect(result).toStrictEqual([{ name, value }]);
  });

  test('attribute names with dashes and colons', () => {
    const input = `data-id="123" link:href="test"`;
    expect(getAttributes(input)).toStrictEqual([
      { name: 'data-id', value: '123' },
      { name: 'link:href', value: 'test' },
    ]);
  });

  test('value containing spaces', () => {
    const input = `title="hello world"`;
    const result = getAttributes(input);
    expect(result).toStrictEqual([{ name: 'title', value: 'hello world' }]);
  });

  test('greater-than sign in attributes', () => {
    const input = `a="1" b=">2"`;
    expect(getAttributes(input)).toStrictEqual([
      { name: 'a', value: '1' },
      { name: 'b', value: '>2' },
    ]);
  });

  // Currently not working, don't want to block release.
  test('invalid attribute without equals is not ignored', () => {
    const input = `a="1" enabled b="2"`;
    const result = getAttributes(input);
    expect(result).toStrictEqual([
      { name: 'a', value: '1' },
      { name: 'enabled', value: '' },
      { name: 'b', value: '2' },
    ]);
  });
});

describe('function getMarkupRenderer', () => {
  test('returns markup renderer', () => {
    const renderer = getMarkupRenderer(SlydeMarkupRenderer.name);
    expect(renderer).toBeInstanceOf(MarkupRenderer);
  });

  test('Getting default MarkupRenderer', () => {
    const call = (): unknown => getMarkupRenderer(SlydeMarkupRenderer.name);
    expect(call).not.toThrow();
  });

  test('Getting a MarkupRenderer with garbage input', () => {
    expect(() => getMarkupRenderer('G4RB4G3')).toThrow();
  });
});

describe('function createComponentInstance', () => {
  const node: XmlParserElementNode = {
    attributes: {},
    children: null,
    name: Point.name,
    type: 'Element',
  } satisfies XmlParserElementNode;

  const state: RenderState = {
    globals: Globals.instance,
    id: 0,
    level: Component.level.block,
    markup: SlydeMarkupRenderer.name,
    /// TODO change later when we change the component interface to reflect the change
    notes: [],
    path: ['test', 'path'] as unknown as string,
  } satisfies RenderState;

  test('returns Component instance', () => {
    const component = createComponentInstance(node, state);
    expect(component).toBeInstanceOf(Component);
  });

  test('Getting a Component', () => {
    const call = (): unknown => createComponentInstance(node, state);
    expect(call).not.toThrow();
  });

  test('Getting a Component with garbage input', () => {
    const element: XmlParserElementNode = { ...node, name: 'G4RB4G3' };
    expect(() => createComponentInstance(element, state)).toThrow();
  });
});
