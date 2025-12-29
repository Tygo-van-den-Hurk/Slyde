import { Component } from '#lib/core/components/class';
import { Logger } from '#lib/logger';

/**
 * The `Image` component. Shows an image.
 */
@Component.register.using({ aliases: ['Img'], plugin: false })
export class Image extends Component {
  /**
   * The source of the image.
   */
  public readonly source: string;

  /**
   * The description of the image.
   */
  public readonly description?: string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Component.ConstructorArguments) {
    super(args);

    if (typeof args.attributes.source === 'string') {
      this.source = args.attributes.source;
    } else if (typeof args.attributes.src === 'string') {
      this.source = args.attributes.src;
    } else {
      throw new Error(`${Image.name} at ${this.path.join('.')} is missing attribute 'source'.`);
    }

    if (typeof args.attributes.description === 'string') {
      this.description = args.attributes.description;
    } else if (typeof args.attributes.alt === 'string') {
      this.description = args.attributes.alt;
    } else {
      Logger.warn(`${Image.name} at ${this.path.join('.')} is missing attribute 'description'.`);
    }

    this.description = args.attributes.description;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({
    children,
  }: Component.RenderArguments): ReturnType<Component.Interface['render']> {
    const description = this.description ?? '';
    const { source } = this;

    if (children) throw new Error(`${Image.name} expected no children at ${this.path.join('.')}`);

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<img src="${source}" alt="${description}">`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
