import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Image } from '#lib/core/components/blocks/image';

describe('class Image implements Component', () => {
  test('Registered', () => {
    expect(Component.retrieve(Image.name)).toBe(Image);
  });

  const construct = {
    attributes: {
      source: 'http://example.com/',
    },
    focusMode: 'default' as const,
    id: '',
    level: Component.level.block,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable with src', () => {
    expect(() => new Image({ ...construct })).not.toThrow();
  });

  test('Is not creatable with src', () => {
    expect(() => new Image({ ...construct, attributes: {} })).toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders without children', () => {
    expect(() => new Image({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('does not render with children', () => {
    expect(() => new Image({ ...construct }).render({ ...render, children })).toThrow();
  });
});
