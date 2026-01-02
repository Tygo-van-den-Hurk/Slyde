import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Presentation } from '#lib/core/components/presentations/presentation';

describe('class Presentation implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Presentation.name)).toBe(Presentation);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: Component.level.presentation,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable', () => {
    expect(() => new Presentation({ ...construct })).not.toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders with children', () => {
    expect(() => new Presentation({ ...construct }).render({ ...render, children })).not.toThrow();
  });

  test('does not render without children', () => {
    expect(() => new Presentation({ ...construct }).render({ ...render })).toThrow();
  });

  test('uses children within somewhere', () => {
    expect(new Presentation({ ...construct }).render({ ...render, children })).toContain(pattern);
  });
});
