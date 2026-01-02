import * as componentUtils from '#lib/core/components/utils';
import type {
  ComponentConstructorArguments,
  ComponentInterface,
  ComponentRenderArguments,
} from '#lib/core/components/interfaces';
import { Logger } from '#lib/logger';
import { Registry } from '#lib/core/registry';

/** The `Component` base class before the registry is injected. */
abstract class Component implements ComponentInterface {
  /** The levels of certain components. Used for selectors: `slyde-component[level=1]`. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly level = Object.freeze({
    /** The level at which the blocks can be placed. */
    block: 2,
    /** The level at which the presentation can be placed. */
    presentation: 0,
    /** The level at which the slides can be placed. */
    slide: 1,
  });

  /** Utils related to components and their workings. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly utils = { ...componentUtils };

  public readonly attributes;
  public readonly focusMode;
  public readonly level;
  public readonly path;
  public readonly id;

  /**
   * Creates a new `Component` from the arguments provided.
   */
  public constructor(args: ComponentConstructorArguments) {
    Logger.debug(`constructing ${new.target.name} at ${args.path}`);
    this.attributes = args.attributes;
    this.focusMode = args.focusMode;
    this.level = args.level;
    this.path = args.path;
    this.id = args.id;
    if (!this.canBeAtLevel(args.level)) {
      throw new Error(
        `${Component.name} ${new.target.name} at ${this.path} cannot be at level ${this.level}. ` +
          `Only at levels: ${this.hierarchy().toString()}`
      );
    }
  }

  public canBeAtLevel(level: number): ReturnType<ComponentInterface['canBeAtLevel']> {
    const hierarchy = this.hierarchy();
    if (hierarchy === '*') return true;
    if (hierarchy.includes(level)) return true;

    const hasPlus = hierarchy[hierarchy.length - 1] === '+';
    // eslint-disable-next-line no-ternary
    const numbers = hasPlus // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      ? (hierarchy.slice(0, -1) as number[]) // eslint-disable-line @typescript-eslint/no-unsafe-type-assertion
      : (hierarchy as unknown as number[]); // eslint-disable-line @typescript-eslint/no-unsafe-type-assertion
    const highestNumber = Math.max(...numbers);
    if (hasPlus && highestNumber < level) return true;

    return false;
  }

  public abstract hierarchy(): ReturnType<ComponentInterface['hierarchy']>;
  public abstract render(arg0: ComponentRenderArguments): ReturnType<ComponentInterface['render']>;
}

/**
 * The base class for any `Component`. A `Component` is a class that can take 0 or more children, attributes, and based
 * on that renders HTML to the final document.
 */
const ComponentWithRegistry = Registry.inject.using({
  extensiveAliases: true,
  name: Component.name,
  substrings: [Component.name],
})(Component);

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
declare namespace ComponentWithRegistry {
  /** The type for an instance of a `MarkupRenderer`. */
  export type Instance = Component;

  /**
   * The arguments to provide to the constructor of a component.
   */
  export type ConstructorArguments = ComponentConstructorArguments;

  /**
   * The arguments to provide to the render function.
   */
  export type RenderArguments = ComponentRenderArguments;

  /**
   * The interface which every instance of `Component` has to comply with.
   */
  export type Interface = ComponentInterface;
}

// eslint-disable-next-line jsdoc/require-jsdoc
export { ComponentWithRegistry as Component };
