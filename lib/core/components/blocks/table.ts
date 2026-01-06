import * as zod from 'zod';
import { Component } from '#lib/core/components/class';
import { Logger } from '#lib/logger';

type printable = string | number | boolean | null;

const toArrayOfData = function toArrayOfData(
  data: unknown,
  context: Component.Interface
): readonly Readonly<Record<string, printable>>[] {
  const result = zod
    .record(zod.string(), zod.string().or(zod.number()).or(zod.boolean()).or(zod.null()))
    .array()
    .readonly()
    .safeParse(data);

  if (result.success) return result.data;
  throw new Error(
    `${context.name} at ${context.path} expected data to be an array of records. instead found: ${JSON.stringify(data)}`,
    {
      cause: result.error,
    }
  );
};

const valueToString = function valueToString(value: printable): string {
  // eslint-disable-next-line no-inline-comments
  return /*HTML*/ `
    <td class="px-4 py-2 border-b">
      ${value}
    </td>
  `;
};

const rowToString = function rowToString(row: Readonly<Record<string, printable>>): string {
  // eslint-disable-next-line no-inline-comments
  return /*HTML*/ `
    <tr>
      ${Object.values(row).map(valueToString).join('\n')}
    </tr>
  `;
};

const headersToString = function headersToString(header: string): string {
  // eslint-disable-next-line no-inline-comments
  return /*HTML*/ `
    <th class="px-4 py-2 text-left border-b">
      ${header}
    </th>
  `;
};

const parsers = {
  json: JSON.parse
} as const;

const getExtension= function getExtension(value: string, context: Component.Interface): string {
  if (value.includes('.')) {
    const extension = value.split('.').pop()?.toLowerCase() ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    if (extension !== '' && extension in parsers) return extension as keyof typeof parsers;
    Logger.warn(`${context.name} at ${context.path}: Could not `)
  }

  return 'json';
};

/**
 * A component that shows the keys in an array of objects.
 */
@Component.register.using({ plugin: false })
export class Table extends Component {
  /** The data for the table. An array of objects. */
  readonly #data = Component.utils.extract({
    aliases: ['file', 'url', 'data'],
    context: this,
    missing: 'error',
  });

  /** The type of data that the file can be. */
  readonly #format = Component.utils.extract({
    aliases: ['format', 'data-type'],
    context: this,
    fallback: 'json',
    transform: Component.utils.transform.enum(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      Object.keys(parsers) as (keyof typeof parsers)[]
    ),
  });

  @Component.utils.children.reject
  // eslint-disable-next-line jsdoc/require-jsdoc
  public async render(): Promise<string> {
    const url = await Component.utils.toDataURL(this.#data);

    const { meta, data } = /^data:(?<meta>.*?),(?<data>.*)$/su.exec(url)?.groups ?? {};
    if (!data) {
      const maxTokens = 20;
      throw new Error(
        `${this.name} at ${this.path} did not get data out of the data URL: "${url.slice(0, maxTokens)}..."`
      );
    }

    const isBase64 = meta.includes('base64');

    // eslint-disable-next-line no-ternary
    const decoded = isBase64
      ? Buffer.from(data, 'base64').toString('utf-8')
      : decodeURIComponent(data);

    const parsed = toArrayOfData(parsers[this.#format](decoded), this);
    if (parsed.length === 0) {
      throw new Error(`${this.name} at ${this.path} receive 0 rows of data`);
    }

    const headers = Object.keys(parsed[0]).map(headersToString).join('\n');
    const rows = parsed.map(rowToString).join('\n');

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <table class="min-w-full border border-foreground rounded-xl overflow-hidden">
        <thead class="bg-primary">
          <tr>
            ${headers}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
