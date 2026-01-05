import type { ComponentInterface } from '#lib/core/components/interfaces';

/** Transforms a string to a boolean. */
const boolean = function boolean(
  value: string | boolean | number,
  context: ComponentInterface,
  key?: string
): boolean {
  switch (value.toString().toLowerCase().trim()) {
    case 'yes':
    case 'y':
    case 'true':
    case 't':
    case '':
    case '1':
    case '+':
      return true;
    case 'no':
    case 'n':
    case 'false':
    case 'f':
    case '0':
    case '-':
      return false;
    default:
      throw new Error(
        `${context.name} at ${context.path}/@${key} expect a boolean, but could not convert "${value}"`
      );
  }
};

/** Transforms a string to a number. */
export const number = function number(
  value: string | number,
  context: ComponentInterface,
  key?: string
): number {
  const result = Number.parseFloat(value.toString());
  if (!Number.isNaN(result)) return result;
  throw new Error(
    `Attribute "padding" from ${context.name} at ${context.path}/@${key} should be a number, but found ${value}`
  );
};

/** Functions to help transform strings to types */
export const transform = Object.freeze({ boolean, number });
