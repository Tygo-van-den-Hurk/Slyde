import { Component } from '#lib/core/components/class';

/**
 * A component that just shows text.
 */
@Component.register.using({ plugin: false })
export class Text extends Component {
  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Component.ConstructorArguments) {
    super(args);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({
    children,
  }: Component.RenderArguments): ReturnType<Component.Interface['render']> {
    if (!children) {
      throw new Error(
        `${Text.name} at ${this.path.join('.')} expected to have children, but found none.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<div class="block py-2">${children()}</div>`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
