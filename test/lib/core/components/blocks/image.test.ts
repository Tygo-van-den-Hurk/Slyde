import * as componentUtils from '#lib/core/components/utils/index';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Image } from '#lib/core/components/blocks/image';

const impl = async (src: string): Promise<string> => Promise.resolve(src);
const spy = vi.spyOn(componentUtils, 'toDataURL').mockImplementation(impl);

describe('class Image implements Component', () => {
  beforeEach(() => {
    spy.mockReset();
  });

  test('Registered', () => {
    expect(Component.retrieve(Image.name)).toBe(Image);
  });

  const construct = {
    attributes: {
      source: 'http://github.com/Tygo-van-den-Hurk.png',
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

  test('renders without children', async () => {
    const image = new Image({ ...construct }) as Component.Interface;
    await expect(image.render({ ...render })).resolves.not.toThrow();
  });

  test('does not render with children', async () => {
    const image = new Image({ ...construct }) as Component.Interface;
    await expect(async () => image.render({ ...render, children })).rejects.toThrow();
  });
});
