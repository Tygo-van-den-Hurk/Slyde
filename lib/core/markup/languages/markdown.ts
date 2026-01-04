import { Marked } from 'marked';
import { MarkupRenderer } from '#lib/core/markup/class';
import { latex1Extension } from '#lib/core/markup/languages/latex';

const getRaw: ({ raw }: Readonly<{ raw: string }>) => string = ({ raw }) => raw;
const getText: ({ text }: Readonly<{ text: string }>) => string = ({ text }) => text;

const parser = new Marked({
  breaks: false,
  gfm: true,
  renderer: {
    blockquote: getRaw,
    heading: getRaw,
    hr: getRaw,
    html: getRaw,
    image: getRaw,
    list: getRaw,
    listitem: getRaw,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    paragraph({ tokens }): string {
      return this.parser.parseInline(tokens);
    },
    table: getRaw,
    tablecell: getText,
    tablerow: getText,
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
