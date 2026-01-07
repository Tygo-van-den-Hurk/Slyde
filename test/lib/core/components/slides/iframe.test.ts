import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { iFrame } from '#lib/core/components/slides/iframe';

describe(`class ${iFrame.name} implements Component`, () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(iFrame.name)).toBe(iFrame);
  });

  const construct = {
    attributes: { src: 'http://example.com/' },
    focusMode: 'default' as const,
    id: '',
    level: 1,
    path: '//',
  } satisfies Component.ConstructorArguments;

  const Frame = iFrame;

  test('Is creatable', () => {
    expect(() => new Frame({ ...construct })).not.toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders without children', async () => {
    const instance = new Frame({ ...construct }) as Component.Interface;
    await expect(Promise.resolve(instance.render({ ...render }))).resolves.not.toThrow();
  });

  test('does not render with children', async () => {
    const instance = new Frame({ ...construct }) as Component.Interface;
    await expect(async () => instance.render({ ...render, children })).rejects.toThrow();
  });
});
