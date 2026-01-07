import { describe, expect, test } from 'vitest';
import { wrapMarkedError } from '#lib/core/markup/utils';

const remove = 'Please report this to https://github.com/markedjs/marked.';

describe('function wrapMarkedError', () => {
  test(`returns an error`, () => {
    const input = new Error(`this is a error:\n${remove}`);
    expect(wrapMarkedError(input).message).not.toContain(remove);
  });

  test(`returns an error from a string`, () => {
    const input = `this is a error:\n${remove}`;
    expect(wrapMarkedError(input).message).not.toContain(remove);
  });

  test(`throws all else`, () => {
    const input = 1;
    expect(() => wrapMarkedError(input)).toThrow();
  });
});
