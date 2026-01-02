import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Text } from '#lib/core/components/blocks/text';

describe('class Text implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Text.name)).toBe(Text);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: Component.level.block,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable', () => {
    expect(() => new Text({ ...construct })).not.toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders with children', () => {
    expect(() => new Text({ ...construct }).render({ ...render, children })).not.toThrow();
  });

  test('does not render without children', () => {
    expect(() => new Text({ ...construct }).render({ ...render })).toThrow();
  });

  test('uses children within somewhere', () => {
    expect(new Text({ ...construct }).render({ ...render, children })).toContain(pattern);
  });
});
