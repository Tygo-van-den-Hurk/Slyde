import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Highlight } from '#lib/core/components/blocks/highlight';

const Class = Highlight;

describe(`class ${Class.name} implements Component`, () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Class.name)).toBe(Class);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: Component.level.block,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable', () => {
    expect(() => new Class({ ...construct })).not.toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders with children', () => {
    expect(() => new Class({ ...construct }).render({ ...render, children })).not.toThrow();
  });

  test('does not render without children', () => {
    expect(() => new Class({ ...construct }).render({ ...render })).toThrow();
  });

  test('uses children within somewhere', () => {
    expect(new Class({ ...construct }).render({ ...render, children })).toContain(pattern);
  });
});
