import { Marked, type RendererObject } from 'marked';
import { MarkupRenderer } from '#lib/core/markup/class';
import { latex1Extension } from '#lib/core/markup/languages/latex';

type Render =
  | 'tablerow'
  | 'tablecell'
  | 'checkbox'
  | 'strong'
  | 'link'
  | 'text'
  | 'em'
  | 'del'
  | 'code'
  | 'codespan';

type AllProps = Required<RendererObject>;
type AllIgnoredProps = Omit<AllProps, Render>;

const parser = new Marked({
  breaks: false,
  gfm: true,
  renderer: {
    // All Markdown properties that should not be rendered
    blockquote: ({ raw }: { readonly raw: string }): typeof raw => raw,
    br: ({ raw }: { readonly raw: string }): typeof raw => raw,
    def: ({ raw }: { readonly raw: string }): typeof raw => raw,
    heading: ({ raw }: { readonly raw: string }): typeof raw => raw,
    hr: ({ raw }: { readonly raw: string }): typeof raw => raw,
    html: ({ raw }: { readonly raw: string }): typeof raw => raw,
    image: ({ raw }: { readonly raw: string }): typeof raw => raw,
    list: ({ raw }: { readonly raw: string }): typeof raw => raw,
    listitem: ({ raw }: { readonly raw: string }): typeof raw => raw,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    paragraph({ tokens, raw }): string {
      const parsed = this.parser.parseInline(tokens);
      const trailingNewlines = /\n+$/u.exec(raw)?.[0] ?? '';
      return parsed + trailingNewlines;
    },
    space: ({ raw }: { readonly raw: string }): typeof raw => raw,
    table: ({ raw }: { readonly raw: string }): typeof raw => raw,
  } satisfies AllIgnoredProps,
  tokenizer: {
    hr: (): undefined => void 0, // eslint-disable-line no-void
    html: (): undefined => void 0, // eslint-disable-line no-void
    list: (): undefined => void 0, // eslint-disable-line no-void
  },
});

parser.use({ extensions: [latex1Extension] });

/**
 * A `MarkupRenderer` for Markdown.
 */
@MarkupRenderer.register.using({ plugin: false })
export class MarkdownRenderer extends MarkupRenderer {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public render(input: string): string {
    try {
      return parser.parse(input, { async: false });
    } catch (error: unknown) {
      throw MarkupRenderer.utils.wrapMarkedError(error);
    }
  }
}
