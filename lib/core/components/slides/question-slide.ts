import { Component } from '#lib/core/components/class';

/**
 * A `Slide` with on it a call to ask questions to the presentor.
 */
@Component.register.using({ plugin: false })
export class QuestionSlide extends Component {
  /** The title of this slide. */
  public readonly title: string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Component.ConstructorArguments) {
    super(args);
    this.title = args.attributes.title ?? 'Questions?';
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="h-full w-full flex justify-center items-center">
        <h2 class="text-primary font-bold text-lg">${this.title}</h2>
        ${children?.() ?? ''}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.slide];
  }
}
