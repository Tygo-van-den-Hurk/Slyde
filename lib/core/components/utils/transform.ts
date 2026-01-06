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

/** Transforms a string to one of the enum options. */
export const transformEnum = function transformEnum<const T extends readonly string[]>(options: T) {
  type Option = T[number];
  return function transform(value: string, context: ComponentInterface, key?: string): Option {
    if (options.includes(value)) return value;
    const path = `${context.path}@${key}`;
    throw new Error(
      `${context.name} expected ${path} to be one of "${options.join('", "')}", but found "${value}".`
    );
  };
};

/** Functions to help transform strings to types */
export const transform = Object.freeze({ boolean, enum: transformEnum, number });
