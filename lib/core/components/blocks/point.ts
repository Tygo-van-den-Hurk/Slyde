import { Component } from '#lib/core/components/class';

const symbolMap = {
  arrow: '&rarr;',
  check: '&#10003;',
  circle: '&bull;',
  cross: '&#10006;',
  dash: '&ndash;',
  diamond: '&#9670;',
  square: '&#9642;',
  star: '&#9733;',
} as const;

/**
 * A component that just shows bullet point. The symbol in front of the component is customisable.
 */
@Component.register.using({ aliases: ['pnt'], plugin: false })
export class Point extends Component {
  /** The symbol to put in front of the "text". */
  readonly #symbol = Component.utils.extract({
    aliases: ['symbol', 'type'],
    context: this,
    fallback: 'dash',
    transform: Component.utils.transform.enum(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      Object.keys(symbolMap) as (keyof typeof symbolMap)[]
    ),
  });

  /** The padding at the top above the point between it and whats above it. */
  readonly #paddingTop = Component.utils.extract({
    aliases: ['padding-top', 'pt'],
    context: this,
    fallback: 1,
    transform: Component.utils.transform.number,
  });

  @Component.utils.children.require
  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const inner = children!();
    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="pt-1 block before:content-['${symbolMap[this.#symbol]}'] before:mr-1 before:text-foreground" 
        style="padding-top: calc(${this.#paddingTop} * var(--unit));">
        ${inner}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
