import { Component } from '#lib/core/components/class';

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
    this.padding = Number.parseInt(args.attributes.padding ?? '4', 10);
    if (Number.isNaN(this.padding)) {
      throw new Error(
        `Expected padding to be a integer, but found ${args.attributes.padding} ` +
          `at ${this.path}.`
      );
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    if (typeof this.title === 'string') {
      // eslint-disable-next-line no-inline-comments
      return /*HTML*/ `
        <div class="w-full h-full" style="padding: calc(${this.padding} * var(--unit));">
          <h2 class="text-primary font-bold text-xl" style="padding-bottom: calc(${this.padding} * var(--unit) / 2);">
            ${this.title}
          </h2>
          <div class="w-full" style="padding: 0px calc(${this.padding} * var(--unit) / 2);">
            ${children?.() ?? ''}
          </div>
        </div>
      `;
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="w-full h-full" style="padding: calc(${this.padding} * var(--unit));">
        ${children?.() ?? ''}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.slide];
  }
}
