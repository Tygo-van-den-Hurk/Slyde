#!/usr/bin/env node

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

import { addCompileSubCommandFlags, compileSubCommandCallback } from '#src/commands/compile';
import { addEnumerateSubCommandFlags, enumerateSubCommandCallback } from '#src/commands/enumerate';
import { addServeSubCommandFlags, serveSubCommandCallback } from '#src/commands/serve';
import {
  disableColorMiddleWare,
  loadPluginsMiddleware,
  printVersionMiddleWare,
  setLogLevelMiddleWare,
} from '#src/middleware';
import { epilogue, pkg } from '#src/const';
import { getStringOrLast, onFail, wrapZodForCleanerError } from '#src/utils';
import FastGlob from 'fast-glob';
import { LogLevel } from '#lib/types/log-level';
import { Logger } from '#lib/logger';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import yargs from 'yargs';

/**
 * The root CLI argument parser.
 */
export const cli = yargs(hideBin(process.argv))
  .strict()
  .wrap(null)
  .demandCommand(1, 'You need to specify a subcommand')
  .scriptName(pkg.name)
  .version('version', 'Show the program version, and then exit.', pkg.version)
  .alias('v', 'version')
  .help('help', 'Show this help message, and then exit.', true)
  .alias('h', 'help')
  .epilogue(epilogue)
  .completion('completion', 'Generate shell completion scripts.')

  // Options

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

  // Middleware

  .middleware(printVersionMiddleWare)
  .middleware(setLogLevelMiddleWare)
  .middleware(disableColorMiddleWare)
  .middleware(loadPluginsMiddleware)

  // SubCommands

  .command(
    'compile [file]',
    'Compile and then write the results to disk.',
    (arg) => addCompileSubCommandFlags(arg),
    async (arg) => compileSubCommandCallback(arg),
  )

  .command(
    'serve [file]',
    'Compile and then serve the results on a webserver.',
    (arg) => addServeSubCommandFlags(arg),
    async (arg) => serveSubCommandCallback(arg),
  )

  .command(
    'enumerate [registry]',
    'List all registered keys in a given registry.',
    addEnumerateSubCommandFlags, 
    enumerateSubCommandCallback,
  )

  // If something goes wrong parsing

  .fail(onFail);

const fileIndex = 1;
const startFile = process.argv[fileIndex];
const isNotBeingImported = import.meta.url === `file://${startFile}`;
const npx = startFile.endsWith(path.join('node_modules', '.bin', pkg.name));
const isBeingExecuted = isNotBeingImported || npx;
if (isBeingExecuted) await cli.parse();
