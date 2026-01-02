import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Point } from '#lib/core/components/blocks/point';

describe('class Point implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Point.name)).toBe(Point);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: Component.level.block,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable', () => {
    expect(() => new Point({ ...construct })).not.toThrow();
  });

  test('Is not creatable with garbage attributes', () => {
    expect(() => new Point({ ...construct, attributes: { type: 'GAR8AG3!' } })).toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders with children', () => {
    expect(() => new Point({ ...construct }).render({ ...render, children })).not.toThrow();
  });

  test('uses children within somewhere', () => {
    expect(new Point({ ...construct }).render({ ...render, children })).toContain(pattern);
  });
});
