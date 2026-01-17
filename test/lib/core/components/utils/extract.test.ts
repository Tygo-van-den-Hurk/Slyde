import { ExtractError, extract } from '#lib/core/components/utils/extract';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Component } from '#lib/core/components';
import { Logger } from '#lib/logger';

const spy = vi.spyOn(Logger, 'warn').mockImplementation(() => {
  // We do nothing with any of the arguments...
});

describe('function extract', () => {
  beforeEach(() => {
    spy.mockReset();
  });

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
  } satisfies Component.Interface;

  test('looking for property that exists', () => {
    const name = 'name';
    const value = 'pattern';
    const aliases = [name];
    const attributes = { [name]: value };
    const context = { ...instance, attributes };
    const result = extract({ aliases, context });
    expect(result).toBe(value);
  });

  test('looking for property that exists somewhere in the attributes', () => {
    const name1 = 'name1';
    const name2 = 'name2';
    const value = 'pattern';
    const aliases = [name1, name2];
    const attributes = { [name2]: value };
    const context = { ...instance, attributes };
    const result = extract({ aliases, context });
    expect(result).toBe(value);
  });

  test('looking for property that does not exist', () => {
    const name1 = 'name1';
    const name2 = 'name2';
    const aliases = [name1, name2];
    const context = { ...instance, attributes: {} };
    const result = extract({ aliases, context });
    expect(result).not.toBeDefined();
  });

  test('testing transform gets applied', () => {
    const name1 = 'name1';
    const name2 = 'name2';
    const transform = (value: string): string => `123${value}`;
    const value = 'pattern';
    const aliases = [name1, name2];
    const attributes = { [name2]: value };
    const context = { ...instance, attributes };
    const fallback = 'fallback';
    const result = extract({ aliases, context, fallback, transform });
    expect(result).toBe(transform(value));
  });

  test('warns when property does not exist and missing is "warn"', () => {
    const name1 = 'name1';
    const name2 = 'name2';
    const aliases = [name1, name2];
    const attributes = {};
    const missing = 'warn';
    const context = { ...instance, attributes };
    extract({ aliases, context, missing });
    expect(spy).toHaveBeenCalled();
  });

  test('throws error when property does not exist and missing is "error"', () => {
    const name1 = 'name1';
    const name2 = 'name2';
    const aliases = [name1, name2];
    const attributes = {};
    const missing = 'error';
    const context = { ...instance, attributes };
    const fn = (): unknown => extract({ aliases, context, missing });
    expect(fn).toThrow(ExtractError);
  });
});
