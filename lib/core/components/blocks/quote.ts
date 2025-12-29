import { Component } from '#lib/core/components/class';
import { Logger } from '#lib/logger';

/**
 * The `Quote` component. Shows a quote by somebody.
 */
@Component.register.using({ plugin: false })
export class Quote extends Component {
  /**
   * Who said the quote.
   */
  public readonly by: string;
  /**
   * A link to the source of the quote.
   */
  public readonly cite?: string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Component.ConstructorArguments) {
    super(args);

    if (typeof args.attributes.by === 'string') {
      this.by = args.attributes.by;
    } else {
      Logger.warn(`${Quote.name} at ${this.path.join('.')} is missing attribute "by".`);
      this.by = 'Unknown';
    }

    if (typeof args.attributes.by === 'string') {
      this.cite = args.attributes.cite;
    } else {
      Logger.warn(`${Quote.name} at ${this.path.join('.')} is missing attribute "cite".`);
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({
    children,
  }: Component.RenderArguments): ReturnType<Component.Interface['render']> {
    if (!children) {
      throw new Error(
        `Expected ${Quote.name} at ${this.path.join('.')} to have children, but found none.`
      );
    }

    let cite = '';
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.cite) cite = `cite="${this.cite}"`;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <blockquote ${cite}>
        <p>${children()}</p>
        <footer><cite>${this.by}</cite></footer>
      </blockquote>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
