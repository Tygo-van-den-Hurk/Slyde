import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Quote } from '#lib/core/components/blocks/quote';

describe('class Quote implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Quote.name)).toBe(Quote);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: Component.level.block,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable', () => {
    expect(() => new Quote({ ...construct })).not.toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders with children', () => {
    expect(() => new Quote({ ...construct }).render({ ...render, children })).not.toThrow();
  });

  test('does not render without children', () => {
    expect(() => new Quote({ ...construct }).render({ ...render })).toThrow();
  });

  test('uses children within somewhere', () => {
    expect(new Quote({ ...construct }).render({ ...render, children })).toContain(pattern);
  });
});
