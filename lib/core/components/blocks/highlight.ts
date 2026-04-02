import { Component } from '#lib/core/components/class';

/**
 * A component that just shows a highlight block with a thicker left border.
 *
 * **Example**:
 * ```Text
 * ┌──────────────────────────────────────────────┐
 * ┃ Some text to highlight                       │
 * └──────────────────────────────────────────────┘
 * ```
 */
@Component.register.using({ plugin: false })
export class Highlight extends Component {
  /** The color of the border around the box. */
  readonly #borderColor: string = Component.utils.extract({
    aliases: ['border-color', 'color'],
    context: this,
    fallback: 'var(--primary)',
  });

  /** The color of the border around the box. */
  readonly #title: string | null = Component.utils.extract({
    aliases: ['title', 'header'],
    context: this,
    fallback: null,
  });

  @Component.utils.children.require
  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    // eslint-disable-next-line no-inline-comments
    let title = /*HTML*/ `
      <h4 class="flex items-center gap-2 text-LG font-semibold" style="color:${this.#borderColor}">
        ${this.#title}
      </h4>
    `;

    if (this.#title === null) title = '';

    const borderColor = `border-color:${this.#borderColor}`;
    const borderWidth = `border-width:calc((1/6)*var(--unit));border-left-width:calc((3/6)*var(--unit));`;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
    <div class="p-1 mt-1" style="${borderColor};${borderWidth}">
      ${title}
      <div id="${this.id}-children-container">
        ${children?.()}
      </div>
    </div>`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
