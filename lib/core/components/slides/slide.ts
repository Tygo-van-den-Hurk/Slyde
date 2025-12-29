import { Component } from '#lib/core/components/class';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const divideBy2 = (num: number): number => num / 2;

/**
 * The `Slide` object. Should be the standard 2nd tier object.
 */
@Component.register.using({ plugin: false })
export class Slide extends Component {
  /** The title of this slide. */
  public readonly title?: string;
  /** The padding this slide. */
  public readonly padding: number;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Component.ConstructorArguments) {
    super(args);
    this.title = args.attributes.title;
    this.padding = Number.parseInt(args.attributes.padding ?? '8', 10);
    if (Number.isNaN(this.padding)) {
      throw new Error(`Expected padding to be a integer, but found ${args.attributes.padding}.`);
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({
    children,
  }: Component.RenderArguments): ReturnType<Component.Interface['render']> {
    if (typeof this.title === 'string')
      // eslint-disable-next-line no-inline-comments
      return /*HTML*/ `
      <div class="p-${this.padding} w-full h-full">
        <h2 class="pb-${divideBy2(this.padding)} text-primary font-bold text-lg">${this.title}</h2>
        <div class="w-full px-${divideBy2(this.padding)}">
          ${children?.() ?? ''}
        </div>
      </div>
    `;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="p-${this.padding} w-full h-full">
        ${children?.() ?? ''}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.slide];
  }
}
