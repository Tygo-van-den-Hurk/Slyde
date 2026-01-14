/** All properties that a Slyde HTML document requires for CSS generation. */
export interface SlydeHtmlDocumentCssProperties {
  /** The background color of the document */
  readonly background: string;
  /** The color of the text. */
  readonly foreground: string;
  /** The primary accent color of the text. */
  readonly primary: string;
  /** The secondary accent color of the text. */
  readonly secondary: string;
  /** The dimensions of the document in `--unit`. Dictates the aspect ratio as well. */
  readonly size: {
    /** The hight of the document in `--unit`. */
    readonly height: number;
    /** The width of the document in `--unit`. */
    readonly width: number;
  };
}
