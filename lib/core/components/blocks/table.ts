import { Marked, type RendererObject } from 'marked';
import { Component } from '#lib/core/components/class';

/**
 * A component that shows the keys in an array of objects.
 */
@Component.register.using({ plugin: false })
export class Table extends Component {
  /** Renders markdown tables, and nothing else. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly parser = new Marked({
    breaks: false,
    gfm: true,
    renderer: {
      blockquote: ({ raw }: { readonly raw: string }): typeof raw => raw,
      br: ({ raw }: { readonly raw: string }): typeof raw => raw,
      code: ({ raw }: { readonly raw: string }): typeof raw => raw,
      codespan: ({ raw }: { readonly raw: string }): typeof raw => raw,
      def: ({ raw }: { readonly raw: string }): typeof raw => raw,
      del: ({ raw }: { readonly raw: string }): typeof raw => raw,
      em: ({ raw }: { readonly raw: string }): typeof raw => raw,
      heading: ({ raw }: { readonly raw: string }): typeof raw => raw,
      hr: ({ raw }: { readonly raw: string }): typeof raw => raw,
      html: ({ raw }: { readonly raw: string }): typeof raw => raw,
      image: ({ raw }: { readonly raw: string }): typeof raw => raw,
      link: ({ raw }: { readonly raw: string }): typeof raw => raw,
      list: ({ raw }: { readonly raw: string }): typeof raw => raw,
      listitem: ({ raw }: { readonly raw: string }): typeof raw => raw,
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      paragraph({ tokens }): string {
        return this.parser.parseInline(tokens);
      },
      space: ({ raw }: { readonly raw: string }): typeof raw => raw,
      strong: ({ raw }: { readonly raw: string }): typeof raw => raw,
      text: ({ raw }: { readonly raw: string }): typeof raw => raw,
    } satisfies Omit<Required<RendererObject>, 'table' | 'tablerow' | 'tablecell' | 'checkbox'>,
  });

  private static style(id: string): string {
    // eslint-disable-next-line no-inline-comments
    return /* CSS */ `
      #id table {
        --line-width: calc(var(--unit) / 8);
        --padding-x:  calc(var(--unit) * 2); 
        --padding-y:  calc(var(--unit) / 2);

        border-collapse: collapse;
        border: none;
        overflow: hidden;

        margin: var(--unit) auto;
      }

      #id th, #id td {
        padding: var(--padding-y) var(--padding-x);
        border-right: var(--line-width) solid var(--foreground);
        border-bottom: var(--line-width) solid var(--foreground);
      }

      #id th {
        text-align: center;
      }

      #id th:last-child, #id td:last-child {
        border-right: none;
      }

      #id tbody tr:last-child td {
        border-bottom: none;
      }
    `.replaceAll('#id', `#${id}`);
  }

  @Component.utils.children.require
  // eslint-disable-next-line jsdoc/require-jsdoc
  public async render({ children }: Component.RenderArguments): Promise<string> {
    const input = (children?.() ?? '').split('\n');
    const trimmed = input.map((line) => line.trim()).join('\n');
    const table = await Table.parser.parse(trimmed);
    const id = `table-${this.id}-container`;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="block" id="${id}">
        <style>${Table.style(id)}</style>
        ${table}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
