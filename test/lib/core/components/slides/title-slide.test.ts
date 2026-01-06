import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { TitleSlide } from '#lib/core/components/slides/title-slide';

describe('class TitleSlide implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(TitleSlide.name)).toBe(TitleSlide);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 1,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable', () => {
    expect(() => new TitleSlide({ ...construct })).not.toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders author if present', async () => {
    const author = 'Tygo van den Hurk';
    const attributes = { author };
    const slide = new TitleSlide({ ...construct, attributes }) as Component.Interface;
    const result = await slide.render({ ...render });
    expect(result).toContain(author);
  });

  test('renders all authors if present', async () => {
    const author1 = 'Tygo van den Hurk';
    const author2 = 'John Doe';
    const authors = `${author1}, ${author2}`;
    const attributes = { authors };
    const slide = new TitleSlide({ ...construct, attributes }) as Component.Interface;
    const result = await slide.render({ ...render });
    expect(result).toContain(author1);
    expect(result).toContain(author2);
  });

  // Required because it returns a string, not a Promise<string> this wrapper turns it into a promise:
  // eslint-disable-next-line @typescript-eslint/return-await
  const wrap = async <T>(fn: () => Promise<T> | T): Promise<T> => await fn();

  test('does not render with children', async () => {
    const slide = new TitleSlide({ ...construct }) as Component.Interface;
    const fn = async (): Promise<string> => slide.render({ ...render, children });
    await expect(wrap(fn)).rejects.toThrow();
  });

  test('renders without children', async () => {
    const slide = new TitleSlide({ ...construct }) as Component.Interface;
    const fn = async (): Promise<string> => slide.render({ ...render })
    await expect(wrap(fn)).resolves.not.toThrow();
  });
});
