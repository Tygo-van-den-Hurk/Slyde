import { LogLevel } from '#lib/types/log-level';
import { Logger } from '#lib/logger';
import chalk from 'chalk';
import { loadPlugins } from '#lib/core/compiler/io';
import pkg from '#package' with { type: 'json' };

/** Middleware that prints the program version on the info line. */
export const printVersionMiddleWare = function printVersionMiddleWare(): void {
  Logger.info(`Using ${chalk.blue(pkg.name)} version ${chalk.blue(pkg.version)}`);

  // @ts-expect-error This is just to check if Bun is the runtime
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (typeof Bun !== 'undefined') Logger.debug(`using Bun version ${Bun.version}`);
  else if (typeof process !== 'undefined' && process.versions.node)
    Logger.debug(`using Node version ${process.versions.node}`);
  else Logger.debug('Unknown runtime');
};

interface LogLevelMiddleWareProps {
  readonly logLevel: LogLevel;
  readonly verbose: number;
}

/** Sets the log level of the debugger based on the amount of times verbose was called. */
export const setLogLevelMiddleWare = function setLogLevelMiddleWare(
  argv: LogLevelMiddleWareProps
): void {
  // More verbose for the value of the count of `verbose`:
  const verbosity = LogLevel.toNumber(argv.logLevel) - argv.verbose;
  Logger.logLevel = LogLevel.fromNumber(verbosity);
  Logger.debug(`Set LogLevel to: ${Logger.logLevel}`);
};

interface DisableColorMiddleWareProps {
  readonly color: string;
}

/** Disables the coloured output when the command is provided. */
export const disableColorMiddleWare = function disableColorMiddleWare(
  argv: DisableColorMiddleWareProps
): void {
  if (argv.color === 'never') chalk.level = 0;
};

interface LoadPluginsMiddlewareProps {
  readonly plugins: readonly string[];
}

/** Loads the plugins in the given directories */
export const loadPluginsMiddleware = async function loadPluginsMiddleware(
  argv: LoadPluginsMiddlewareProps
): Promise<void> {
  await loadPlugins(argv.plugins);
  Logger.info(`Loaded ${argv.plugins.length} plugins.`);
  if (argv.plugins.length > 0) {
    Logger.debug(
      'Those loaded plugins being:',
      argv.plugins.map((plugin) => chalk.gray(plugin)).join(', ')
    );
  }
};
