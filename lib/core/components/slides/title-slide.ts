import { Component } from '#lib/core/components/class';

/**
 * A `Slide` with the title and possibly the author
 */
@Component.register.using({ plugin: false })
export class TitleSlide extends Component {
  /** The title of this slide. */
  public readonly title: string;

  /** The author under the title. */
  public readonly authors?: readonly string[];

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Component.ConstructorArguments) {
    super(args);
    this.title = args.attributes.title ?? 'Questions?';

    if (typeof args.attributes.authors === 'string') {
      this.authors = args.attributes.authors.split(',');
    } else if (typeof args.attributes.author === 'string') {
      this.authors = [args.attributes.author];
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    let authors = '';

    if (this.authors) authors = `<p>${this.authors.join('<br>')}</p>`;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="h-full w-full flex justify-center items-center">
        <h2 class="text-primary font-bold text-lg">${this.title}</h2>
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
