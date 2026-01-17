import { describe, expect, test } from 'vitest';
import type { ComponentInterface } from '#lib/core/components';
import transform from '#lib/core/components/utils/transform';

const error = function error(): never {
  throw new Error('Function not implemented.');
}

const instance = {
  attributes: {},
  canBeAtLevel: error,
  display: '',
  focusMode: 'follows',
  hierarchy: error,
  id: '0',
  level: 0,
  name: '',
  path: 'xpath://',
  render: error,
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
    expect(boolean(input, instance, 'key')).toBe(expected);
  });

  test('throws on invalid boolean', () => {
    expect(() => boolean('maybe', instance, 'key')).toThrow();
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
    expect(number(input, instance, 'padding')).toBe(expected);
  });

  test('throws on invalid number', () => {
    expect(() => number('abc', instance, 'padding')).toThrow();
  });
});

describe('function transform.enum', () => {
  const colors = ['red', 'green', 'blue'] as const;
  const colorEnum = transform.enum(colors);

  test.each(colors)('accepts valid enum value "%s"', (value) => {
    expect(colorEnum(value, instance, 'color')).toBe(value);
  });

  test('throws on invalid enum', () => {
    expect(() => colorEnum('yellow', instance, 'color')).toThrow();
  });
});
