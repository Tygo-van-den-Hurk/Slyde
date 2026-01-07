import { describe, expect, test } from 'vitest';
import transform from '#lib/core/components/utils/transform';
import { ComponentInterface, ComponentRenderArguments } from '#lib/core/components';

const fakeContext = {
  attributes: {},
  canBeAtLevel(): boolean {
    throw new Error('Function not implemented.');
  },
  focusMode: 'follows',
  hierarchy(): ReturnType<ComponentInterface['hierarchy']> {
    throw new Error('Function not implemented.');
  },
  id: '',
  level: 0,
  name: 'TestComponent',
  path: '/test/path',
  render(): string {
    throw new Error('Function not implemented.');
  },
} satisfies ComponentInterface;

describe('function transform.boolean', () => {
  const { boolean } = transform;

  test.each([
    ['yes', true],
    ['Y', true],
    ['true', true],
    ['1', true],
    ['+', true],
    ['', true],
    ['no', false],
    ['N', false],
    ['false', false],
    ['0', false],
    ['-', false],
  ])('converts "%s" to %s', (input, expected) => {
    expect(boolean(input, fakeContext, 'key')).toBe(expected);
  });

  test('throws on invalid boolean', () => {
    expect(() => boolean('maybe', fakeContext, 'key')).toThrow();
  });
});

describe('function transform.number', () => {
  const { number } = transform;

  test.each([
    ['42', 42],
    ['3.14', 3.14],
    [10, 10],
    ['0', 0],
  ])('converts "%s" to %s', (input, expected) => {
    expect(number(input, fakeContext, 'padding')).toBe(expected);
  });

  test('throws on invalid number', () => {
    expect(() => number('abc', fakeContext, 'padding')).toThrow();
  });
});

describe('function transform.enum', () => {
  const colors = ['red', 'green', 'blue'] as const;
  const colorEnum = transform.enum(colors);

  test.each(colors)('accepts valid enum value "%s"', (value) => {
    expect(colorEnum(value, fakeContext, 'color')).toBe(value);
  });

  test('throws on invalid enum', () => {
    expect(() => colorEnum('yellow', fakeContext, 'color')).toThrow();
  });
});
