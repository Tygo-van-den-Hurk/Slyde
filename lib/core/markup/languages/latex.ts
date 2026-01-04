import { type LiteAdaptor, liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import type { LiteElement } from 'mathjax-full/js/adaptors/lite/Element.js';
import { MarkupRenderer } from '#lib/core/markup/class';
import type { MathDocument } from 'mathjax-full/js/core/MathDocument.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import type { Token } from 'marked';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { RegisterHTMLHandler as registerHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { Logger } from '#lib/logger';

const adaptor: LiteAdaptor = liteAdaptor();
registerHTMLHandler(adaptor);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const document: MathDocument<LiteElement, string, string> = mathjax.document('', {
  InputJax: new TeX({
    formatError(_jax: unknown, error: unknown): never {
      if (error !== null && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string')
          throw new Error(`Could not render latex: ${error.message}`, { cause: error });
      }
      throw error;
    },
  }),
  OutputJax: new SVG({ fontCache: 'local' }),
});

/**
 * A MarkupRenderer for Markdown that converts LaTeX (in math mode) into an inline SVG.
 */
@MarkupRenderer.register.using({ plugin: false })
export class LatexRenderer extends MarkupRenderer {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public render(input: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const node = document.convert(input, { display: false }) as LiteElement;
    return adaptor.outerHTML(node);
  }
}

// ~ MARKED EXTENSION ~ latex

interface TokenizerReturn {
  raw: string;
  text: string;
  type: string;
  tokens?: Token[];
}

const latexRenderer = new LatexRenderer();

/** The `marked` extension to render latex within 2 dollar symbols. */
export const latex2Extension = {
  level: 'inline' as const,
  name: 'latex-2-dollars',
  renderer: function renderer(token: Readonly<{ text: string }>): string {
    return latexRenderer.render(token.text);
  },
  start: (src: string): number => src.indexOf('$$'),
  tokenizer: function tokenizer(src: string): undefined | TokenizerReturn {
    const rule = /^\$\$(?<text>(?:\\\$\$|[^$])+?)\$\$/u;
    const match = rule.exec(src);
    if (match?.groups) {
      const text = match.groups.text.replace(/\\\$\$/gu, '$$');
      const token: TokenizerReturn = {
        raw: match[0],
        text,
        type: 'latex-2-dollars',
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

/** The `marked` extension to render latex within 1 dollar symbol. */
export const latex1Extension = {
  level: 'inline' as const,
  name: 'latex-1-dollar',
  renderer: function renderer(token: Readonly<{ text: string }>): string {
    return latexRenderer.render(token.text);
  },
  start: (src: string): number => src.indexOf('$'),
  tokenizer: function tokenizer(src: string): undefined | TokenizerReturn {
    const rule = /^\$(?<text>(?:\\\$|[^$])+?)\$/u;
    const match = rule.exec(src);
    if (match?.groups) {
      const text = match.groups.text.replace(/\\\$/gu, '$');
      const token: TokenizerReturn = {
        raw: match[0],
        text,
        type: 'latex-1-dollar',
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
