import * as componentUtils from '#lib/core/components/utils/index';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Component } from '#lib/core/components/class';
import { QrCode } from '#lib/core/components';

const impl = async (src: string): Promise<string> => Promise.resolve(src);
const spy = vi.spyOn(componentUtils, 'toDataURL').mockImplementation(impl);

describe(`class ${QrCode.name} implements ${Component.name}`, () => {
  beforeEach(() => {
    spy.mockReset();
  });

  test('Registered', () => {
    expect(Component.retrieve(QrCode.name)).toBe(QrCode);
  });

  const construct = {
    attributes: {
      url: 'http://github.com/Tygo-van-den-Hurk.png',
      version: '30',
    },
    focusMode: 'default' as const,
    id: '',
    level: Component.level.block,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable with src', () => {
    expect(() => new QrCode({ ...construct })).not.toThrow();
  });

  test('Is not creatable without src', () => {
    expect(() => new QrCode({ ...construct, attributes: {} })).toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders without children', async () => {
    const image = new QrCode({ ...construct }) as Component.Interface;
    await expect(image.render({ ...render })).resolves.not.toThrow();
  });

  test('does not render with children', async () => {
    const image = new QrCode({ ...construct }) as Component.Interface;
    await expect(async () => image.render({ ...render, children })).rejects.toThrow();
  });
});
