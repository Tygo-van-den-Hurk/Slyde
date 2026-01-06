import { Component } from '#lib/core/components/class';

/**
 * A component that just shows text.
 */
@Component.register.using({ plugin: false })
export class Text extends Component {
  @Component.utils.children.require
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<div class="block py-2">${children?.()}</div>`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
