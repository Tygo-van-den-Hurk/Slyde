import * as utils from '#lib/core/markup/utils';
import type { MarkupRendererInterface } from '#lib/core/markup/interfaces';
import { Registry } from '#lib/core/registry';

/** The `MarkupRenderer` base class before the registry is injected. */
abstract class MarkupRenderer implements MarkupRendererInterface {
  /** Common utilities for markup renderers. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly utils = Object.freeze({ ...utils });
  public abstract render(input: string): ReturnType<MarkupRendererInterface['render']>;
}

/**
 * The base class for any `MarkupRenderer`. A `MarkupRenderer` is responsible for rendering it's specific
 * [markup languages](https://en.wikipedia.org/wiki/Markup_language) into HTML. Examples of this are:
 * [Markdown](https://en.wikipedia.org/wiki/Markdown), [XML](https://en.wikipedia.org/wiki/XML), and of
 * course [HTML](https://en.wikipedia.org/wiki/HTML).
 */
const MarkupRendererWithRegistry = Registry.inject.using({
  extensiveAliases: true,
  name: MarkupRenderer.name,
  substrings: ['MarkupRenderer', 'Markup', 'MarkupLanguage', 'Renderer'],
})(MarkupRenderer);

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
declare namespace MarkupRendererWithRegistry {
  /** The type for an instance of a `MarkupRenderer`. */
  export type Instance = MarkupRenderer;
}

// eslint-disable-next-line jsdoc/require-jsdoc
export { MarkupRendererWithRegistry as MarkupRenderer };
