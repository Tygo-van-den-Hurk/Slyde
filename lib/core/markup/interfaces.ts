/**
 * The interface for any `MarkupRender`.
 */
export interface MarkupRendererInterface {
  /** Renders a string from the markup language into HTML */
  render: (input: string) => Promise<string> | string;
}

/**
 * Constraints on the constructor type of any `MarkupRender`.
 */
export type ConstructableMarkupRenderer = new () => MarkupRendererInterface;
