/* eslint-disable max-classes-per-file */

import type {
  ComponentConstructorArguments,
  ComponentInterface,
  ComponentLevels,
  ComponentRenderArguments,
} from '#lib/core/components/interfaces';
import { Logger } from '#lib/logger';
import { Registry } from '#lib/core/registry';
import componentUtils from '#lib/core/components/utils/index';

/** Incorporates the constructor arguments into itself. */
const Base = class Component implements ComponentConstructorArguments {
  readonly #name;
  readonly #attributes;
  readonly #focusMode;
  readonly #level;
  readonly #path;
  readonly #id;

  /**
   * Creates a new `Component` from the arguments provided.
   */
  public constructor(args: ComponentConstructorArguments) {
    Logger.debug(`constructing ${new.target.name} at ${args.path}`);
    this.#name = new.target.name;
    this.#attributes = args.attributes;
    this.#focusMode = args.focusMode;
    this.#level = args.level;
    this.#path = args.path;
    this.#id = args.id;
  }

  /** Utils related to components and their workings. */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static get utils() {
    return Object.freeze({ ...componentUtils });
  }

  /** The levels of certain components. Used for selectors: `slyde-component[level=1]`. */
  public static get level(): ComponentLevels {
    return Object.freeze({ block: 2, presentation: 0, slide: 1 });
  }

  public get name(): ComponentInterface['name'] {
    return this.#name;
  }

  public get attributes(): ComponentInterface['attributes'] {
    return this.#attributes;
  }

  public get focusMode(): ComponentInterface['focusMode'] {
    return this.#focusMode;
  }

  public get level(): ComponentInterface['level'] {
    return this.#level;
  }

  public get path(): ComponentInterface['path'] {
    return this.#path;
  }

  public get id(): ComponentInterface['id'] {
    return this.#id;
  }
};

/** The `Component` base class before the registry is injected. */
abstract class Component extends Base implements ComponentInterface {
  readonly #width = Component.utils.extract({
    aliases: ['width', 'w'],
    context: this,
    transform(value, context, key) {
      const { name, path, level } = context;
      if (level > Component.level.slide || (value ?? '') === '') return value;
      Logger.warn(`${name} at ${path} cannot use property "${key}", ignoring value "${value}"`);
      return void 0; // eslint-disable-line no-void
    },
  });

  readonly #height = Component.utils.extract({
    aliases: ['height', 'h'],
    context: this,
    transform(value, context, key) {
      const { name, path, level } = context;
      if (level > Component.level.slide || (value ?? '') === '') return value;
      Logger.warn(`${name} at ${path} cannot use property "${key}", ignoring value "${value}"`);
      return void 0; // eslint-disable-line no-void
    },
  });

  readonly #display = Component.utils.extract({
    aliases: ['display', 'd'],
    context: this,
    fallback: 'block',
    transform(value, context, key) {
      const { name, path, level } = context;
      if (level > Component.level.slide || value === 'block') return value;
      Logger.warn(`${name} at ${path} cannot use property "${key}", ignoring value "${value}"`);
      return 'block';
    },
  });

  public constructor(args: ComponentConstructorArguments) {
    super(args);
    if (!this.canBeAtLevel(this.level)) {
      throw new Error(
        `${this.name} at ${this.path} cannot be at level ${this.level}. ` +
          `Only at levels: ${this.hierarchy().toString()}`
      );
    }
  }

  public get width(): string | undefined {
    return this.#width;
  }

  public get height(): string | undefined {
    return this.#height;
  }

  public get display(): string {
    return this.#display;
  }

  public canBeAtLevel(level: number): ReturnType<ComponentInterface['canBeAtLevel']> {
    const hierarchy = (this as Partial<this>).hierarchy?.() ?? '*';
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

  /** The levels at which certain types of components live. */
  export type Levels = ComponentLevels;

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
