/**
 * The arguments to provide to the constructor of a component.
 */
export interface ComponentConstructorArguments {
  /**
   * The ID given to a component at creation. This will be the ID that it will have in the final document, and
   * specifies the focus order, and creation order that happend. Allows you to
   */
  readonly id: string;

  /**
   * The focus behaviors that this component will have, as specified in the source document.
   * - **follows**: as long as this component or any of it's children have focus, it has focus.
   * - **default**: This component will not share its focus group with it's children unless it's parents specify
   *   otherwise, in which case it will behave as it's parents specified.
   * - **group**: as long as this component or any of it's children have focus, it and all of its children all have
   *   focus.
   */
  readonly focusMode: 'follows' | 'default' | 'group';

  /**
   * The attributes a component got in the source file. So for example:
   *
   * ```XML
   * <component attr1="val1" attr2="val2" ... />
   * ```
   *
   * becomes the following record:
   *
   * ```YAML
   * { attr1: "val1", attr2: "val2", ... }
   * ```
   *
   * it is up to the component to look for them in the constructor and enforce that all required ones are there.
   */
  readonly attributes: Readonly<Record<string, string | undefined>>;

  /**
   * The Xpath at which this element is located.
   */
  readonly path: string;

  /**
   * How deep the component is in the tree. For example if we look at the following presentation:
   *
   * ```XML
   * <presentation>
   *   <slide>
   *     <point>Because Slyde is amazing</point>
   *   </slide>
   * </presentation>
   * ```
   *
   * Then presentation has a level of `0`, slide a level of `1`, and point a level of `2`.
   */
  readonly level: number;
}

/**
 * The arguments to provide to the render function.
 */
export interface ComponentRenderArguments {
  /**
   * Renders the children to HTML to and returns the output. If the component has no children then this function is
   * missing.
   */
  readonly children?: () => string;
}

/**
 * The implementation of it's XML name. for example, take this config:
 *
 * ```XML
 * <presentation>
 *   <slide>
 *     <point>
 *     </point>
 *   </slide>
 * </presentation>
 * ```
 *
 * In this config `Presentation`, `Slide`, and `Point` are all `Component`s.
 */
export interface ComponentInterface extends ComponentConstructorArguments {
  /**
   * The name of the `Component` class. For example when constructing: `<presentation />` the name property
   * will be `Presentation`. It will match the name the class itself has.
   */
  readonly name: string;

  /**
   * Render this component to HTML.
   */
  readonly render: (argo0: Readonly<ComponentRenderArguments>) => Promise<string> | string;

  /**
   * The levels at which this component is allowed to be used. End with a plus to allow any level deeper then the last
   * mentioned level. Cannot be empty, or only contain a plus. Use `'*'` to allow all levels.
   */
  readonly hierarchy: () =>
    | readonly [number, ...number[]]
    | readonly [...[number, ...number[]], '+']
    | '*';

  /**
   * Whether or not an instance of `Component` can be at a level `n`. Uses the `hierarch` function to determine what
   * levels are and are not allowed.
   */
  readonly canBeAtLevel: (level: number) => boolean;
}

/**
 * Constraints on the constructor type of any `Component` for it to be considered registerable.
 */
export type ConstructableComponent = new (
  arg0: Readonly<ComponentConstructorArguments>
) => ComponentInterface;
