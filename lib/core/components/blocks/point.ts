import * as zod from 'zod';
import { Component } from '#lib/core/components/class';

const symbolOptions = [
  'arrow',
  'check',
  'circle',
  'cross',
  'dash',
  'diamond',
  'square',
  'star',
] as const;

const symbolParser = zod.enum(symbolOptions);

type Symbol = zod.infer<typeof symbolParser>;

const symbolMap: Record<Symbol, string> = {
  arrow: '&rarr;',
  check: '&#10003;',
  circle: '&bull;',
  cross: '&#10006;',
  dash: '&ndash;',
  diamond: '&#9670;',
  square: '&#9642;',
  star: '&#9733;',
};

const defaultSymbol = 'dash' as Symbol;
const aliases = ['symbol', 'type'] as readonly string[];

/**
 * A component that just shows bullet point. The symbol in front of the component is customisable.
 */
@Component.register.using({ aliases: ['pnt'], plugin: false })
export class Point extends Component {
  /** The symbol to put in front of the "text". */
  readonly #symbol: zod.infer<typeof symbolParser> = Component.utils.extract({
    aliases,
    context: this,
    fallback: defaultSymbol,
    // eslint-disable-next-line no-restricted-syntax
    transform: (value) => {
      const result = symbolParser.safeParse(value);
      if (result.success) return result.data;
      throw new Error(
        `${Component.name} ${Point.name} at ${this.path} expected attribute "${aliases.join('" or "')}" ` +
          `be one of "${symbolOptions.join('", "')}", but found: ${value}`
      );
    },
  });

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    if (!children) {
      throw new Error(`Expected ${Point.name} at ${this.path} to have children, but found none.`);
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="pt-1 block before:content-['${symbolMap[this.#symbol]}'] before:mr-2 before:text-black">
        ${children()}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
