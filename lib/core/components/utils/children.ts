import type { ComponentInterface, ComponentRenderArguments } from '#lib/core/components/interfaces';

const expected = 'render';
type RenderFn = ComponentInterface[typeof expected];

/** Decorates a render function rejecting it if it is passed children. */
export const reject = function reject<This extends ComponentInterface, Fn extends RenderFn>(
  fn: Fn,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  context: ClassMethodDecoratorContext<This, Fn>
): Fn {
  const fullName = 'Component.utils.children.reject';
  if (fn.name !== expected) {
    throw new Error(
      `Configuration error: you can only use ${fullName} on the ${expected} method, ` +
        `not on ${context.kind} "${fn.name}".`
    );
  }

  const wrapper = function wrapper(
    this: ComponentInterface,
    args: ComponentRenderArguments
  ): ReturnType<Fn> {
    // eslint-disable-next-line no-void, @typescript-eslint/no-unsafe-type-assertion
    if (args.children === void 0) return fn.call(this, args) as ReturnType<Fn>;
    throw new Error(
      `${this.name} at ${this.path} does not expect children, but was provided some.`
    );
  };

  Object.defineProperty(wrapper, 'name', {
    configurable: true,
    enumerable: false,
    value: fullName,
    writable: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return wrapper as unknown as Fn;
};

/** Decorates a render function require it is passed children. */
export const require = function require<This extends ComponentInterface, Fn extends RenderFn>(
  fn: Fn,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  context: ClassMethodDecoratorContext<This, Fn>
): Fn {
  const fullName = 'Component.utils.children.require';
  if (context.name !== expected) {
    throw new Error(
      `${String(context.name)} has a configuration problem. Can only use ${fullName} on the ${expected} method, ` +
        `not on method ${fn.name}.`
    );
  }

  const wrapper = function wrapper(
    this: ComponentInterface,
    args: ComponentRenderArguments
  ): ReturnType<Fn> {
    // eslint-disable-next-line no-void, @typescript-eslint/no-unsafe-type-assertion
    if (args.children !== void 0) return fn.call(this, args) as ReturnType<Fn>;
    throw new Error(`${this.name} at ${this.path} expects children, but was given none.`);
  };

  Object.defineProperty(wrapper, 'name', {
    configurable: true,
    enumerable: false,
    value: fullName,
    writable: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return wrapper as unknown as Fn;
};

// eslint-disable-next-line jsdoc/require-jsdoc, import/no-default-export
export default { reject, require };
