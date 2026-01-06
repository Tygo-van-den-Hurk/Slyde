import { Component } from '#lib/core/components/class';

/**
 * A `Slide` with an embedded site inside of it, allows for some very custom things. The inner site does not scale
 * using `--unit`, so it will look different on each screen.
 */
@Component.register.using({ plugin: false })
export class iFrame extends Component {
  /** The URL of the source of the site. */
  readonly #src = Component.utils.extract({
    aliases: ['source', 'src', 'url'],
    context: this,
    missing: 'error',
  });

  /** Permissions granted to the iframe via the `allow` attribute. */
  readonly #allow = Component.utils.extract({
    aliases: ['allow'],
    context: this,
    fallback: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
  });

  /** Accessible title for the iframe. */
  readonly #title = Component.utils.extract({
    aliases: ['title', 'header'],
    context: this,
    missing: 'warn',
  });

  /** Whether to enable the iframe `sandbox` attribute. */
  readonly #sandbox = Component.utils.extract({
    aliases: ['sandbox'],
    context: this,
    fallback: true,
    transform: Component.utils.transform.boolean,
  });

  /** Whether to enable the (legacy) `seamless` attribute. */
  readonly #seamless = Component.utils.extract({
    aliases: ['seamless'],
    context: this,
    fallback: true,
    transform: Component.utils.transform.boolean,
  });

  /** Referrer policy applied to the iframe. */
  readonly #referrerPolicy = Component.utils.extract({
    aliases: ['referrer-policy', 'referrer'],
    context: this,
    fallback: 'origin',
  });

  /** Value for the `frameborder` attribute. */
  readonly #frameborder = Component.utils.extract({
    aliases: ['frameborder'],
    context: this,
    fallback: false,
    transform: Component.utils.transform.boolean,
  });

  @Component.utils.children.reject
  // eslint-disable-next-line jsdoc/require-jsdoc
  public render(): string {
    let frameborder = '',
      sandbox = '',
      seamless = '';

    if (this.#sandbox) sandbox = 'sandbox';
    if (this.#seamless) seamless = 'seamless';
    if (!this.#frameborder) frameborder = `frameborder="0"`;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <iframe ${sandbox} ${seamless} ${frameborder}
        title="${this.#title ?? 'an unknown embedded website'}" 
        id="${this.id}-iframe"
        class="h-full w-full"
        src="${this.#src}"
        allow="${this.#allow}"
        referrerpolicy=${this.#referrerPolicy}
      >
        <div class="h-full w-full flex justify-center items-center overflow-hidden">
        Could not load content.
        </div>
      </iframe>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.slide];
  }
}
