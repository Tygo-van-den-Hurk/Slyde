import { Component } from '#lib/core/components/class';

/**
 * The encompassing `Presentation` object. Should hold all slides.
 */
@Component.register.using({ plugin: false })
export class Presentation extends Component {
  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    if (!children) {
      throw new Error(
        `${Component.name} ${Presentation.name} expected to have children, but found none at ${this.path}.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <main>
        ${children()}
      </main>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.presentation];
  }
}
