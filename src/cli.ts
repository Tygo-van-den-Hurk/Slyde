#!/usr/bin/env node

import * as zod from 'zod';
import { BasePath, type DeepReadonly, LogLevel, Logger, Registry } from '#lib';
import { CompileArgs, compileFromCliArgs } from '#src/compile';
import { ServeArgs, serve } from '#src/serve';
import FastGlob from 'fast-glob';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';
import { loadPlugins } from '#lib/core/compiler/io';
import path from 'path';
import pkg from '#package' with { type: 'json' };
import yargs from 'yargs';

// Helpers

const NAME = 'slyde';
const VERSION = pkg.version;
const EPILOGUE = `
For the documentation go to ${chalk.underline.cyan(pkg.homepage)}. You can report bugs or create request features by opening an 
issue on ${chalk.underline.cyan(pkg.bugs.url)}, or even better yet a pull request. To see the source code for yourself, you can
go to ${chalk.underline.cyan(pkg.repository.url)}.
`
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .join(' ');

/** If argument is a string, return it, if it is an array of strings, return the last one. */
const getStringOrLast = function getStringOrLast(value: string | readonly string[]): string {
  if (typeof value === 'string') return value;
  return value[value.length - 1];
};

/**
 * Wraps a zod parsing function so that we can use the messages of the original
 * instead of Yargs making my life harder.
 */
const wrapZodForCleanerError = function wrapZodForCleanerError<T>(name: string, arg0: () => T): T {
  try {
    return arg0();
  } catch (error: unknown) {
    if (error instanceof zod.ZodError) {
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

// CLI arguments

/**
 * The root CLI argument parser.
 */
export const cli = yargs(hideBin(process.argv))
  .strict()
  .wrap(null)
  .demandCommand(1, 'You need to specify a subcommand')
  .scriptName(NAME)
  .version('version', 'Show the program version, and then exit.', VERSION)
  .alias('v', 'version')
  .help('help', 'Show this help message, and then exit.', true)
  .alias('h', 'help')
  .epilogue(EPILOGUE)
  .completion('completion', 'Generate shell completion scripts.')

  .option('plugins', {
    alias: 'p',
    array: true,
    coerce: (value: readonly string[]) => FastGlob.sync([...value]),
    default: [
      'plugins/**.{js,mjs}',
      'slyde/**.{js,mjs}',
      '**/*.plugins.{js,mjs}',
      '**/*.plugin.{js,mjs}',
      '**/*.slyde.{js,mjs}',
    ] as string[],
    description: 'A directory or file to import and use as custom tags',
    type: 'string',
  })

  .option('log-level', {
    alias: 'l',
    choices: LogLevel.options,
    coerce: (value: string | readonly string[]) =>
      wrapZodForCleanerError('--log-level/-l', () => LogLevel.parser.parse(getStringOrLast(value))),
    default: Logger.DEFAULT_LOG_LEVEL,
    description: `Log level to use when running.`,
    type: 'string',
  })

  .option('verbose', {
    alias: 'V',
    default: 0,
    description: 'Whether to be more talkative. Makes it more verbose by one step one per flag.',
    type: 'count',
  })

  .option('color', {
    choices: ['never', 'auto', 'always'],
    default: 'auto',
    describe: 'Enable or disable color output.',
    type: 'string',
  })

  // Middlewares

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, prefer-arrow-callback
  .middleware(function setLoglevelOnLogger(argv): void {
    // More verbose for the value of the count of `verbose`:
    const verbosity = LogLevel.toNumber(argv.logLevel) - argv.verbose;
    Logger.logLevel = LogLevel.fromNumber(verbosity);
    Logger.debug(`Set LogLevel to: ${Logger.logLevel}`);
  })

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, prefer-arrow-callback
  .middleware(function disableColor(argv): void {
    // Set the color value
    const disabled = 0;
    if (argv.color === 'never') chalk.level = disabled;
  })

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, prefer-arrow-callback
  .middleware(async function loadPluginsMiddleware(argv): Promise<void> {
    await loadPlugins(argv.plugins);
    Logger.info(`Loaded ${argv.plugins.length} plugins.`);
    Logger.debug(
      'Those loaded plugins being:',
      argv.plugins.map((plugin) => chalk.gray(plugin)).join(', ')
    );
  })

  // Compile subcommand
  .command(
    'compile [file]',
    'Compile and then write the results to disk.',
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types,
    (subYargs) =>
      subYargs
        .epilogue(EPILOGUE)

        .option('output', {
          alias: 'o',
          coerce: (value: string | readonly string[]) => path.resolve(getStringOrLast(value)),
          default: CompileArgs.defaults.output,
          description: 'The path to write the output to',
          type: 'string',
        })

        .positional('file', {
          alias: 'input',
          default: CompileArgs.defaults.file,
          describe: 'The file to compile, and then serve',
          type: 'string',
        }),

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    async (args) => {
      await compileFromCliArgs(args as DeepReadonly<CompileArgs>);
    }
  )

  // Serve subcommand
  .command(
    'serve [file]',
    'Compile and then serve the results on a webserver.',
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types,
    (subYargs) =>
      subYargs
        .epilogue(EPILOGUE)

        .option('host', {
          alias: 'H',
          coerce: (value: string | readonly string[]) =>
            wrapZodForCleanerError('--host/-H', () =>
              zod.ipv4().or(zod.ipv6()).parse(getStringOrLast(value))
            ),
          default: ServeArgs.defaults.host,
          description: 'The host to use ports from.',
          type: 'string',
        })

        .option('port', {
          alias: 'P',
          coerce: (value: string | number) =>
            wrapZodForCleanerError('--port/-P', () => zod.int().parse(value)),
          default: ServeArgs.defaults.port,
          description: 'The port to listen on and serve the slides from.',
          type: 'number',
        })

        .option('base-path', {
          alias: 'B',
          coerce: (value: string) =>
            wrapZodForCleanerError('--base-path/-B', () => BasePath.parser.parse(value)),
          default: ServeArgs.defaults.basePath,
          description: 'The base path to serve from. If specified, serve from that subdirectory.',
          type: 'string',
        })

        .positional('file', {
          alias: 'input',
          default: CompileArgs.defaults.file,
          describe: 'The file to compile, and then serve',
          type: 'string',
        }),

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    async (args) => {
      await serve({ ...args, output: '' });
    }
  )

  // List subcommand
  .command(
    'enumerate [registry]',
    'List all registered keys in a given registry.',
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types,
    (subYargs) =>
      subYargs
        .epilogue(EPILOGUE)

        .option('yaml', {
          alias: 'y',
          description: 'Outputs the registered keys in that registry as YAML',
          type: 'boolean',
        })

        .option('json', {
          alias: 'j',
          description: 'Outputs the registered keys in that registry as JSON',
          type: 'boolean',
        })

        .conflicts('yaml', 'json')

        .positional('registry', {
          alias: 'input',
          demandOption: true,
          describe: 'The registry to print the keys',
          type: 'string',
        }),

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, prefer-arrow-callback
    function callback(args): void {
      const registry = Registry.retrieve(args.registry);
      if (!registry) {
        Logger.critical(`No such registry: ${args.registry}`);
        return;
      }

      const keys = registry.keys();

      let result; // eslint-disable-line @typescript-eslint/init-declarations
      if ((args.yaml ?? false) && keys.length > 0) result = `- "${keys.join('"\n- "')}"`;
      else if (args.json ?? false) result = JSON.stringify(keys);
      else result = keys.join(' ');

      // eslint-disable-next-line no-console
      console.log(result);
    }
  )

  // Argument fails

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types,, no-restricted-syntax
  .fail((message?: string, error?: Error) => {
    if (error) {
      Logger.critical(error.message);
      Logger.debug(error.stack);
      process.exit(1);
    }

    Logger.critical('Invalid usage:', message);
    process.exit(1);
  });

// If file is being executed instead of sourced:

const fileIndex = 1;
const isBeingExecuted = import.meta.url === `file://${process.argv[fileIndex]}`;
if (isBeingExecuted) await cli.parse();
