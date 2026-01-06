/* eslint-disable jsdoc/check-param-names, jsdoc/require-param-type */

import type { ComponentInterface } from '#lib/core/components/interfaces';
import { Logger } from '#lib/logger';

/** Generates the error messages for the extract function. */
export class ExtractError extends Error {
  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(message: string, context: ComponentInterface, key?: string) {
    let suffix = '';
    if ((key ?? '') !== '') suffix = `@${key}`;
    super(`Problem with ${context.name} at ${context.path}${suffix}: ${message}`);
  }
}

/** Extract the value from the from the record, given a list of aliases. */
export const find = function find({
  aliases,
  record,
}: {
  readonly aliases: readonly string[];
  readonly record: Readonly<Record<string, string | undefined>>;
}): [string, string] | [undefined, undefined] {
  for (const alias of aliases) {
    const candidate = record[alias];
    if (typeof candidate !== 'string') continue;
    return [candidate, alias];
  }

  // eslint-disable-next-line no-void
  return [void 0, void 0];
};

/**
 * Extracts a key from a record of attributes, or uses the fallback if none of the aliases were present in the record.
 * Then applies a transform to final value. Allows for easy extraction of properties for components. You can provide
 * the context argument to generate better error messages.
 *
 * ```TypeScript
 * export class Image extends Component {
 *
 *   public readonly source = Component.utils.extract({
 *     aliases: ['source', 'src'],
 *     context: this,
 *     missing: 'error',
 *     transform: (value) => toDataUrl(value) // only sync functions
 *   });
 *
 *   public readonly description = Component.utils.extract({
 *     aliases: ['description', 'alt'],
 *     context: this,
 *     fallback: 'an image provided by the user',
 *     missing: 'warn',
 *   });
 *
 * }
 * ```
 *
 * Arguments:
 * @template F - Type of the fallback value.
 * @template T - Type returned by the transform function.
 * @param aliases - List of attribute names to look for in `context.attributes`.
 * @param context - The component instance providing `name`, `path`, and `attributes`.
 * @param fallback - Value to use if none of the aliases exist in the attributes (optional).
 * @param transform - Function to convert the found value or fallback to a different type (optional).
 * @param missing - How to handle missing values when no fallback is provided:
 *   - `'accept'` returns `undefined`
 *   - `'warn'` logs a warning
 *   - `'error'` throws an error (default: `'accept'`).
 * @throws { Error} if `missing` is `'error'` and no attribute or fallback is found.
 */
// Fallback with transform
export function extract<F, T>({
  aliases,
  context,
  fallback,
  transform,
}: {
  readonly aliases: readonly string[];
  readonly context: ComponentInterface;
  readonly fallback: F;
  readonly transform: (value: string | F, context: ComponentInterface, key?: string) => T;
}): T;

// Fallback without transform
export function extract<F>({
  aliases,
  context,
  fallback,
}: {
  readonly aliases: readonly string[];
  readonly context: ComponentInterface;
  readonly fallback: F;
}): string | F;

// No fallback but transform, missing is error
export function extract<T>({
  aliases,
  context,
  missing,
  transform,
}: {
  readonly aliases: readonly string[];
  readonly context: ComponentInterface;
  readonly missing: 'error';
  readonly transform: (value: string, context: ComponentInterface, key?: string) => T;
}): T;

// No fallback but transform, missing is accept or warn (or omitted)
export function extract<T>({
  aliases,
  context,
  missing,
  transform,
}: {
  readonly aliases: readonly string[];
  readonly context: ComponentInterface;
  readonly missing?: 'accept' | 'warn';
  readonly transform: (
    value: string | undefined,
    context: ComponentInterface,
    key?: string
  ) => T | undefined;
}): T | undefined;

// No fallback and no transform, but missing is error
export function extract({
  aliases,
  context,
  missing,
}: {
  readonly aliases: readonly string[];
  readonly context: ComponentInterface;
  readonly missing: 'error';
}): string;

// No fallback and no transform (this should be LAST)
export function extract({
  aliases,
  context,
  missing,
}: {
  readonly aliases: readonly string[];
  readonly context: ComponentInterface;
  readonly missing?: 'accept' | 'warn';
}): string | undefined;

// Implementation
export function extract<F, T>({
  aliases,
  context,
  fallback,
  missing = 'accept',
  transform,
}: {
  readonly aliases: readonly string[];
  readonly context: ComponentInterface;
  readonly fallback?: F;
  readonly missing?: 'accept' | 'warn' | 'error';
  readonly transform?: (value: string | F, context: ComponentInterface, key?: string) => T;
}): T | F | string | undefined {
  type Result = [string, string] | [F, undefined] | [undefined, undefined];
  let [value, key]: Result = find({ aliases, record: context.attributes });

  // eslint-disable-next-line no-void
  if (typeof value !== 'string') [value, key] = [fallback, void 0];

  // eslint-disable-next-line no-void
  if (value === void 0) {
    const attributes = aliases.join(', or ');
    switch (missing) {
      case 'warn':
        Logger.warn(`${context.name} is missing one of the following attributes ${attributes}`);
        break;
      case 'error':
        throw new ExtractError(
          `missing one of the following required attributes: ${attributes}`,
          context,
          key
        );
      case 'accept':
      default:
    }
    // eslint-disable-next-line no-void
    return void 0;
  }

  if (!transform) return value;
  return transform(value, context, key);
}

// eslint-disable-next-line jsdoc/require-jsdoc, import/no-default-export
export default extract;
