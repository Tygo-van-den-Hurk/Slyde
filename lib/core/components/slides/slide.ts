import { Component } from '#lib/core/components/class';

/**
 * The `Slide` object. Should be the standard 2nd tier object.
 */
@Component.register.using({ plugin: false })
export class Slide extends Component {
  /** The title of this slide. If none are provided, then it is not displayed. */
  readonly #title?: string = Component.utils.extract({
    aliases: ['title', 'header'],
    context: this,
  });

  /** The padding on this slide. Dictates both the padding on the edges as well as between the title and main area. */
  readonly #padding: number = Component.utils.extract({
    aliases: ['padding', 'p'],
    context: this,
    fallback: '4' as const,
    // eslint-disable-next-line no-restricted-syntax
    transform: (value) => {
      const result = Number.parseFloat(value);
      if (!Number.isNaN(result)) return result;
      throw new Error(
        `Attribute "padding" from ${this.name} at ${this.path} should be a number, but found ${value}`
      );
    },
  });

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    if (typeof this.#title === 'string') {
      // eslint-disable-next-line no-inline-comments
      return /*HTML*/ `
        <div class="w-full h-full overflow-hidden" style="padding: calc(${this.#padding} * var(--unit));">
          <h2 class="text-primary font-bold text-xl" style="padding-bottom: calc(${this.#padding} * var(--unit) / 2);">
            ${this.#title}
          </h2>
          <div class="w-full" style="padding: 0px calc(${this.#padding} * var(--unit) / 2);">
            ${children?.() ?? ''}
          </div>
        </div>
      `;
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="w-full h-full overflow-hidden" style="padding: calc(${this.#padding} * var(--unit));">
        ${children?.() ?? ''}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.slide];
  }
}
