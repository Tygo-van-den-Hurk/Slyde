import { Logger } from '#lib/logger';
import { Registry } from '#lib/core/registry';
import { epilogue } from '#src/const';
import type yargs from 'yargs';

/** Adds the command line parameters for the `enumerate` command. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const addEnumerateSubCommandFlags = function addEnumerateSubCommandFlags<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  subYargs: yargs.Argv<T>
) {
  return subYargs
    .epilogue(epilogue)

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
      required: true,
      type: 'string',
    });
};

interface enumerateCallbackProps {
  readonly registry: string;
  readonly yaml?: boolean;
  readonly json?: boolean;
}

/** The callback function to exec when the `enumerate` command is given. */
export const enumerateSubCommandCallback = function enumerateSubCommandCallback(
  args: enumerateCallbackProps
): void {
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
};
