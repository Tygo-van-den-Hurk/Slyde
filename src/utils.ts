import { LogLevel } from '#lib/types/log-level';
import { Logger } from '#lib/logger';
import { ZodError } from 'zod';
import chalk from 'chalk';

/** If argument is a string, return it, if it is an array of strings, return the last one. */
export const getStringOrLast = function getStringOrLast(value: string | readonly string[]): string {
  if (typeof value === 'string') return value;
  return value[value.length - 1];
};

/**
 * Wraps a zod parsing function so that we can use the messages of the original
 * instead of Yargs making my life harder.
 */
export const wrapZodForCleanerError = function wrapZodForCleanerError<T>(
  name: string,
  arg0: () => T
): T {
  try {
    return arg0();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      const issues = error.issues.map((issue) => issue.message).join(',');
      const were = error.issues.length === 1 ? 'was' : 'were'; // eslint-disable-line no-ternary
      const s = error.issues.length === 1 ? '' : 's'; // eslint-disable-line no-ternary, id-length
      const message = `There ${were} ${error.issues.length} ${chalk.red(`issue${s}`)} with ${name}: ${issues}`;
      throw new Error(message, { cause: error });
    }

    throw error;
  }
};

/** A function to run if argument parsing fails. */
export const onFail = function onFail(message: string, error?: Readonly<Error>): never {
  if (error) {
    let finalLog = error.message;
    const debugMode = LogLevel.of(Logger.logLevel).isMoreOrAsVerboseAs(LogLevel.DEBUG);
    if (debugMode) finalLog = error.stack ?? error.message;
    Logger.critical(finalLog);
    process.exit(1);
  }

  Logger.critical('Invalid usage:', message);
  process.exit(1);
}
