import { Marked, type RendererObject, type Token } from 'marked';
import { MarkupRenderer } from '#lib/core/markup/class';
import { latex2Extension } from '#lib/core/markup/languages/latex';

interface TokenizerReturn {
  raw: string;
  text: string;
  type: string;
  tokens?: Token[];
}

// ~ SLYDE MARKUP EXTENSION ~ bold

/** The `marked` extension to render bold Slyde markup */
export const slydeBoldExtension = {
  level: 'inline' as const,
  name: 'slyde-bold',
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  renderer: function renderer(token: Readonly<{ text: string; tokens?: Token[] }>): string {
    // @ts-expect-error - this.parser exists on the renderer context
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-ternary, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const text = token.tokens ? this.parser.parseInline(token.tokens) : token.text;
    return `<strong>${text}</strong>`;
  },
  start: (src: string): number => src.indexOf('**'),
  tokenizer: function tokenizer(src: string): undefined | TokenizerReturn {
    const rule = /^\*\*(?<text>(?:\\\*\*|[^*])+?)\*\*/u;
    const match = rule.exec(src);
    if (match?.groups) {
      const text = match.groups.text.replace(/\\\*\*/gu, '**');
      const token: TokenizerReturn = {
        raw: match[0],
        text,
        type: 'slyde-bold',
      };
      // @ts-expect-error - this.lexer exists on the tokenizer context
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      token.tokens = this.lexer.inlineTokens(text);
      return token;
    }

    // eslint-disable-next-line no-undefined
    return undefined;
  },
};

// ~ SLYDE MARKUP EXTENSION ~ italic

/** The `marked` extension to render italic Slyde markup. */
export const slydeItalicExtension = {
  level: 'inline' as const,
  name: 'slyde-italic',
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  renderer: function renderer(token: Readonly<{ text: string; tokens?: Token[] }>): string {
    // @ts-expect-error - this.parser exists on the renderer context
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-ternary, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const text = token.tokens ? this.parser.parseInline(token.tokens) : token.text;
    return `<em>${text}</em>`;
  },
  start: (src: string): number => src.indexOf('//'),
  tokenizer: function tokenizer(src: string): undefined | TokenizerReturn {
    const rule = /^\/\/(?<text>(?:\\\/\/|[^/])+?)\/\//u;
    const match = rule.exec(src);
    if (match?.groups) {
      const text = match.groups.text.replace(/\\\/\//gu, '//');
      const token: TokenizerReturn = {
        raw: match[0],
        text,
        type: 'slyde-italic',
      };

      // @ts-expect-error - this.lexer exists on the tokenizer context
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      token.tokens = this.lexer.inlineTokens(text);
      return token;
    }

    // eslint-disable-next-line no-undefined
    return undefined;
  },
};

// ~ SLYDE MARKUP EXTENSION ~ superscript

/** The `marked` extension to render superscript Slyde markup. */
export const slydeSuperscriptExtension = {
  level: 'inline' as const,
  name: 'slyde-superscript',
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  renderer: function renderer(token: Readonly<{ text: string; tokens?: Token[] }>): string {
    // @ts-expect-error - this.parser exists on the renderer context
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-ternary, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const text = token.tokens ? this.parser.parseInline(token.tokens) : token.text;
    return `<sup>${text}</sup>`;
  },
  start: (src: string): number => src.indexOf('^^'),
  tokenizer: function tokenizer(src: string): undefined | TokenizerReturn {
    const rule = /^\^\^(?<text>(?:\\\^\^|[^^])+?)\^\^/u;
    const match = rule.exec(src);
    if (match?.groups) {
      const text = match.groups.text.replace(/\\\^\^/gu, '^^');
      const token: TokenizerReturn = {
        raw: match[0],
        text,
        type: 'slyde-superscript',
      };

      // @ts-expect-error - this.lexer exists on the tokenizer context
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      token.tokens = this.lexer.inlineTokens(text);
      return token;
    }

    // eslint-disable-next-line no-undefined
    return undefined;
  },
};

// ~ SLYDE MARKUP EXTENSION ~ underlined

/** The `marked` extension to render underlined Slyde markup */
export const slydeUnderlineExtension = {
  level: 'inline' as const,
  name: 'slyde-underline',
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  renderer: function renderer(token: Readonly<{ text: string; tokens?: Token[] }>): string {
    // @ts-expect-error - this.parser exists on the renderer context
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-ternary, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const text = token.tokens ? this.parser.parseInline(token.tokens) : token.text;
    return `<u>${text}</u>`;
  },
  start: (src: string): number => src.indexOf('__'),
  tokenizer: function tokenizer(src: string): undefined | TokenizerReturn {
    const rule = /^__(?<text>(?:\\__|[^_])+?)__/u;
    const match = rule.exec(src);
    if (match?.groups) {
      const text = match.groups.text.replace(/\\__/gu, '__');
      const token: TokenizerReturn = {
        raw: match[0],
        text,
        type: 'slyde-underline',
      };

      // @ts-expect-error - this.lexer exists on the tokenizer context
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      token.tokens = this.lexer.inlineTokens(text);
      return token;
    }

    // eslint-disable-next-line no-undefined
    return undefined;
  },
};

// ~ SLYDE MARKUP EXTENSION ~ code

/** The `marked` extension to render code/monospaced Slyde markup. */
const slydeCodeExtension = {
  level: 'inline' as const,
  name: 'slyde-code',
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  renderer: function renderer(token: Readonly<{ text: string; tokens?: Token[] }>): string {
    return `<code>${token.text}</code>`;
  },
  start: (src: string): number => src.indexOf('``'),
  tokenizer: function tokenizer(src: string): undefined | TokenizerReturn {
    const rule = /^``(?<text>(?:\\``|[^`])+?)``/u;
    const match = rule.exec(src);
    if (match?.groups) {
      const text = match.groups.text.replace(/\\``/gu, '``');
      const token: TokenizerReturn = {
        raw: match[0],
        text,
        type: 'slyde-code',
      };

      // @ts-expect-error - this.lexer exists on the tokenizer context
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      token.tokens = this.lexer.inlineTokens(text);
      return token;
    }

    // eslint-disable-next-line no-undefined
    return undefined;
  },
};

// ~ SLYDE MARKUP EXTENSION ~ strikethrough

const strikeExtension = {
  level: 'inline' as const,
  name: 'slyde-strike',
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  renderer: function renderer(token: Readonly<{ text: string; tokens?: Token[] }>): string {
    // @ts-expect-error - this.parser exists on the renderer context
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-ternary, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const text = token.tokens ? this.parser.parseInline(token.tokens) : token.text;
    return `<s>${text}</s>`;
  },
  start: (src: string): number => src.indexOf('~~'),
  tokenizer: function tokenizer(src: string): undefined | TokenizerReturn {
    const rule = /^~~(?<text>(?:\\~~|[^~])+?)~~/u;
    const match = rule.exec(src);
    if (match?.groups) {
      const text = match.groups.text.replace(/\\~~/gu, '~~');
      const token: TokenizerReturn = {
        raw: match[0],
        text,
        type: 'slyde-strike',
      };

      // @ts-expect-error - this.lexer exists on the tokenizer context
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      token.tokens = this.lexer.inlineTokens(text);
      return token;
    }

    // eslint-disable-next-line no-undefined
    return undefined;
  },
};

// ~ SLYDE MARKUP EXTENSION ~ strikethrough

const slydeLatexExtension = latex2Extension;

// ~ MARKED EXTENSIONS ~ //

/** All slyde extension for `marked`, a markdown parsing library. */
export const slydeMarkedExtensions = [
  slydeBoldExtension,
  slydeUnderlineExtension,
  slydeSuperscriptExtension,
  slydeCodeExtension,
  strikeExtension,
  slydeItalicExtension,
  slydeLatexExtension,
];

// ~ MARKED PARSER ~ //

type Ignore = 'tablerow' | 'tablecell' | 'checkbox' | 'strong' | 'link' | 'text';
type AllProps = Required<RendererObject>;
type AllIgnoredProps = Omit<AllProps, Ignore>;

const parser = new Marked({
  breaks: false,
  gfm: true,
  renderer: {
    // All Markdown properties that should not be rendered
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

parser.use({ extensions: [...slydeMarkedExtensions] });

/**
 * A `MarkupRenderer` for Slyde' unique markup language.
 */
@MarkupRenderer.register.using({ aliases: ['DefaultMarkupRenderer'], plugin: false })
export class SlydeMarkupRenderer extends MarkupRenderer {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public render(input: string): string {
    try {
      return parser.parse(input, { async: false });
    } catch (error: unknown) {
      throw MarkupRenderer.utils.wrapMarkedError(error);
    }
  }
}
