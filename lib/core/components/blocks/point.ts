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
const transform = function transform(
  value: string,
  context: Component.Interface,
  key?: string
): Symbol {
  const result = symbolParser.safeParse(value);
  if (result.success) return result.data;
  let suffix = ` with attributes "${aliases.join('", "')}"`;
  if (typeof key === 'string') suffix = `@${key}`;
  throw new Error(
    `${context.name} at ${context.path}${suffix} expected attribute to be ` +
      `be one of "${symbolOptions.join('", "')}", but found: ${value}`
  );
};

/**
 * A component that just shows bullet point. The symbol in front of the component is customisable.
 */
@Component.register.using({ aliases: ['pnt'], plugin: false })
export class Point extends Component {
  /** The symbol to put in front of the "text". */
  readonly #symbol = Component.utils.extract({
    aliases,
    context: this,
    fallback: defaultSymbol,
    transform,
  });

  /** The padding at the top above the point between it and whats above it. */
  readonly #paddingTop = Component.utils.extract({
    aliases: ['padding-top', 'pt'],
    context: this,
    fallback: 1,
    transform: Component.utils.transform.number,
  });

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): string {
    if (!children) {
      throw new Error(`Expected ${this.name} at ${this.path} to have children, but found none.`);
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="pt-1 block before:content-['${symbolMap[this.#symbol]}'] before:mr-1 before:text-foreground" 
        style="padding-top: calc(${this.#paddingTop} * var(--unit));">
        ${children()}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
