import * as compiler from '#lib/core/compiler/index';
import { promises as FileSystem } from 'fs';
import { LogLevel } from '#lib/types/log-level';
import { Logger } from '#lib/logger';
import chalk from 'chalk';
import { epilogue } from '#src/const';
import { getStringOrLast } from '#src/utils';
import ora from 'ora';
import path from 'path';
import type yargs from 'yargs';

/** Adds the command line parameters for the `compile` command. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const addCompileSubCommandFlags = function addCompileSubCommandFlags<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  subYargs: yargs.Argv<T>
) {
  return subYargs
    .epilogue(epilogue)

    .option('output', {
      alias: 'o',
      coerce: (value: string | readonly string[]) => path.resolve(getStringOrLast(value)),
      default: 'slyde.html',
      description: 'The path to write the output to',
      type: 'string',
    })

    .positional('file', {
      alias: 'input',
      default: 'slyde.xml',
      describe: 'The file to compile, and then serve',
      type: 'string',
    });
};

/** The arguments to the compile function */
export interface CompileArgs {
  readonly file: string;
  readonly plugins: readonly string[];
  readonly output: string;
}

/** The callback function to exec when the `compile` command is given. */
export const compileSubCommandCallback = async function compileSubCommandCallback(
  options: CompileArgs
): Promise<void> {
  const content = await compiler.compile(options);

  const spinner = ora({
    isSilent: LogLevel.of(Logger.logLevel).isLessVerboseThen(LogLevel.INFO),
    prefixText: chalk.cyan(LogLevel.INFO.toUpperCase()),
  }).start(`writing to disk...`);

  try {
    await FileSystem.writeFile(options.output, content);
    spinner.succeed(`${chalk.green('Success')}: wrote the result to disk!`);
  } catch (error) {
    const prefix = chalk.red(LogLevel.ERROR.toUpperCase());

    if (error instanceof Error) {
      const { message } = new Error(`Unable to write to ${options.output}: ${error.message}`, {
        cause: error,
      });
      spinner.fail(`${prefix}: ${message}`);
    } else if (typeof error === 'string') {
      const { message } = new Error(`Unable to write to ${options.output}`);
      spinner.fail(`${prefix}: ${message}`);
    }

    throw error;
  }
};
