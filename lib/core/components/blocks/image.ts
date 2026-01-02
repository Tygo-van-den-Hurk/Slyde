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

    const source = Component.utils.extract({
      aliases: ['source', 'src'],
      record: args.attributes,
    });

    if (typeof source !== 'string') {
      throw new Error(`${Image.name} at ${this.path} is missing attribute 'source'.`);
    }

    const description = Component.utils.extract({
      aliases: ['description', 'alt'],
      record: args.attributes,
    });

    if (typeof description !== 'string') {
      Logger.warn(`${Image.name} at ${this.path} is missing attribute 'description'.`);
    }

    this.source = source;
    this.description = description;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public async render({ children }: Component.RenderArguments): Promise<string> {
    const description = this.description ?? '';
    const source = await Component.utils.toDataURL(this.source);

    if (children) throw new Error(`${Image.name} expected no children at ${this.path}`);

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<img src="${source}" alt="${description}">`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
