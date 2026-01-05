/**
 * The interface for any `MarkupRender`.
 */
export interface MarkupRendererInterface {
  /** The name of the markup renderer */
  readonly name: string;
  /** Renders a string from the markup language into HTML */
  readonly render: (input: string) => Promise<string> | string;
}

/**
 * Constraints on the constructor type of any `MarkupRender`.
 */
export type ConstructableMarkupRenderer = new () => MarkupRendererInterface;
