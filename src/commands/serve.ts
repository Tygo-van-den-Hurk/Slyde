import * as compiler from '#lib/core/compiler/index';
import { BasePath, type RequireAll } from '#lib/types/index';
import express, { type Request, type Response, Router } from 'express';
import { getStringOrLast, wrapZodForCleanerError } from '#src/utils';
import type { CompileArgs } from '#src/commands/compile';
import { Logger } from '#lib/logger';
import { StatusCodes } from 'http-status-codes';
import { epilogue } from '#src/const';
import type yargs from 'yargs';
import zod from 'zod';

/** Adds the command line parameters for the `serve` command. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const addServeSubCommandFlags = function addServeSubCommandFlags<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  subYargs: yargs.Argv<T>
) {
  return subYargs
    .epilogue(epilogue)

    .option('host', {
      alias: 'H',
      coerce: (value: string | readonly string[]) =>
        wrapZodForCleanerError('--host/-H', () =>
          zod.ipv4().or(zod.ipv6()).parse(getStringOrLast(value))
        ),
      default: '0.0.0.0',
      description: 'The host to use ports from.',
      type: 'string',
    })

    .option('port', {
      alias: 'P',
      coerce: (value: string | number) =>
        wrapZodForCleanerError('--port/-P', () => zod.int().parse(value)),
      default: 8484,
      description: 'The port to listen on and serve the slides from.',
      type: 'number',
    })

    .option('base-path', {
      alias: 'B',
      coerce: (value: string) =>
        wrapZodForCleanerError('--base-path/-B', () => BasePath.parser.parse(value)),
      default: '/',
      description: 'The base path to serve from. If specified, serve from that subdirectory.',
      type: 'string',
    })

    .positional('file', {
      alias: 'input',
      default: 'slyde.xml',
      describe: 'The file to compile, and then serve',
      type: 'string',
    });
};

let compiled: string | undefined = '';

/**
 * Serves the responds to the client.
 */
export const serveResult = function serveResult(
  request: Request, // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
  response: Response // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
): void {
  Logger.info(`request made for ${request.url} from ${request.ip}`);
  response.status(StatusCodes.OK).send(compiled);
};

/**
 * The default callback when none has been defined.
 */
export const callback = function callback(
  args: Readonly<RequireAll<ServeArgs>>,
  error?: Readonly<Error>
): void {
  if (error) Logger.error(`Error starting server: ${error.message}`);
  const DROP_FIRST_CHAR = 1;
  Logger.info(
    `server started on port http://${args.host}:${args.port}/${args.basePath.slice(DROP_FIRST_CHAR)}`
  );
};

/** The options to call this callback with. */
export interface ServeArgs extends Omit<CompileArgs, 'output'> {
  /**
   * The base path to serve from. Allows you to serve from e.g. the `/presentation` subdirectory.
   * So you'd have to request `https://example.com/presentation` to get the presentation.
   */
  readonly basePath: BasePath;

  /**
   * The port to listen on.
   */
  readonly port: number;

  /**
   * The host to respond on.
   */
  readonly host: string;
}

/** The callback function to exec when the `serve` command is given. */
export const serveSubCommandCallback = async function serveSubCommandCallback(
  options: ServeArgs
): Promise<void> {
  compiled = await compiler.compile(options);
  const router = Router(); // eslint-disable-line new-cap
  router.get(/.*/u, serveResult);
  const app = express();
  app.use(options.basePath, router);
  const callbackWrapper = (error?: Readonly<Error>): void => {
    callback(options, error);
  };
  app.listen(options.port, options.host, callbackWrapper);
};
