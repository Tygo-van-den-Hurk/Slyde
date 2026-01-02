import type { Component } from '#lib/core/components/class';

/** Stores all global variables while rendering */
export class Globals {
  /** Store the one instance of the global state */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly store = new Globals();

  /** All `Component`s used in the rendering procedure. */
  public readonly componentsUsed = new Set<Component.Instance>();

  private constructor() {
    // Cannot make one from the outside
  }

  /** Gets an instance of the global state */
  public static instance: () => Globals = () => Globals.store;
}

/** The general rendering state of each individual element in the XML tree. */
export interface RenderState {
  /** The path to get to this element in the XML file. Is in Xpath format. */
  readonly path: string;
  /** The level at which this component is in the tree. */
  readonly level: number;
  /** A unique identifier of this component. */
  readonly id: number;
  /** The markup renderer to use when styling any text within this component. */
  readonly markup: string;
  /** The presentor notes that would be visible at this time. */
  readonly notes: readonly string[];
  /** All global attributes that should even change things above in the tree */
  readonly globals: () => Globals;
}

/**
 * An XML attribute pair, consisting of a name and a value.
 *
 * ```XML
 * <element attr1="value1" attr2="value2" />
 * ```
 *
 * Would be
 *
 * ```YAML
 * - name: "attr1"
 *   value: "value1"
 * - name: "attr2"
 *   value: "value2"
 * ```
 */
export interface Attribute {
  /** The name of the attribute */
  readonly name: string;
  /** The value of the attribute */
  readonly value: string;
}
