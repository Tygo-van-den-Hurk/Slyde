import { Component } from '#lib/core/components/class';

/**
 * The `Image` component. Shows an image.
 */
@Component.register.using({ aliases: ['Img'], plugin: false })
export class Image extends Component {
  /** The source of the image. Will be read of disk, or fetched of the internet. */
  readonly #source: string = Component.utils.extract({
    aliases: ['source', 'src'],
    context: this,
    missing: 'error',
  });

  /** The description of the image. Will be used for screen readers and such. */
  readonly #description?: string = Component.utils.extract({
    aliases: ['description', 'alt'],
    context: this,
    missing: 'warn',
  });

  @Component.utils.children.reject
  // eslint-disable-next-line jsdoc/require-jsdoc
  public async render(): Promise<string> {
    const description = this.#description ?? '';
    const source = await Component.utils.toDataURL(this.#source);
    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<img class="h-full w-full object-fill" src="${source}" alt="${description}">`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
