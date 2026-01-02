import * as zod from 'zod';
import { Component } from '#lib/core/components/class';

const symbolOptions = [
  'circle',
  'dash',
  'star',
  'arrow',
  'square',
  'diamond',
  'check',
  'cross',
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

/**
 * A component that just shows bullet point.
 */
@Component.register.using({ plugin: false })
export class Point extends Component {
  public readonly symbol: zod.infer<typeof symbolParser>;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Component.ConstructorArguments) {
    super(args);

    const aliases = ['symbol', 'type'] as readonly string[];
    const extracted = Component.utils.extract({
      aliases,
      fallback: defaultSymbol,
      record: args.attributes,
    });

    const result = symbolParser.safeParse(extracted);
    if (result.error) {
      throw new Error(
        `Expected property by the names of "${aliases.join('", "')}" of ${Point.name} at ${this.path} to ` +
          `be one of "${symbolOptions.join('", "')}", but found: ${args.attributes.type}`
      );
    }

    this.symbol = result.data;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    if (!children) {
      throw new Error(`Expected ${Point.name} at ${this.path} to have children, but found none.`);
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="pt-1 block before:content-['${symbolMap[this.symbol]}'] before:mr-2 before:text-black">
        ${children()}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
