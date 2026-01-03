import { Component } from '#lib/core/components/class';

/**
 * The `Quote` component. Shows a quote by somebody.
 */
@Component.register.using({ plugin: false })
export class Quote extends Component {
  /** Who said the quote. Will be displayed with the quote */
  readonly #by?: string = Component.utils.extract({
    aliases: ['by'],
    context: this,
    missing: 'warn',
  });

  /** A link to the source of the quote. */
  readonly #cite?: string = Component.utils.extract({
    aliases: ['cite', 'url', 'ref', 'reference'],
    context: this,
    missing: 'warn',
  });

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    if (!children) {
      throw new Error(`Expected ${this.name} at ${this.path} to have children, but found none.`);
    }

    let cite = '';
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.#cite) cite = `cite="${this.#cite}"`;

    let footer = '';
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, no-inline-comments
    if (this.#by) footer = /*HTML*/ `<footer><cite>${this.#by}</cite></footer>`;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <blockquote ${cite}>
        <p>${children()}</p>
        ${footer}
      </blockquote>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
