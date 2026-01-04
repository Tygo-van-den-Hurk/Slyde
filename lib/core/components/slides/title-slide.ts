import { Component } from '#lib/core/components/class';

/**
 * A `Slide` with the title and possibly the author
 */
@Component.register.using({ plugin: false })
export class TitleSlide extends Component {
  /** The title of this slide. */
  readonly #title?: string = Component.utils.extract({
    aliases: ['title', 'header'],
    context: this,
  });

  /** The author under the title for this slide. */
  readonly #authors?: readonly string[] = Component.utils.extract({
    aliases: ['authors', 'author', 'by'],
    context: this,
    transform: (value: string | undefined) => value?.split(',').map((author) => author.trim()),
  });

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    let authors = '';

    if (this.#authors) authors = `<p>${this.#authors.join('<br>')}</p>`;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="h-full w-full flex justify-center items-center overflow-hidden">
        <h2 class="text-primary font-bold text-lg">${this.#title}</h2>
        ${authors}
        ${children?.() ?? ''}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.slide];
  }
}
