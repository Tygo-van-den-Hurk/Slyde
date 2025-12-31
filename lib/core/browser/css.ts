import { Component } from '#lib/core/components/class';

/** All properties that a Slyde HTML document requires. */
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

/** The config for tailwind in the browser. */
export const tailwindConfig = function tailwindConfig({
  background,
  foreground,
  secondary,
  primary,
}: SlydeHtmlDocumentCssProperties): { theme: Record<string, Record<string, unknown>> } {
  return {
    theme: {
      /**
       * Allow **only** these colors.
       */
      colors: { background, foreground, primary, secondary },

      /**
       * Extend the tailwind config with these options.
       */
      extend: {},

      /** The different font sizes */
      fontSize: {
        '2xl': 'calc(var(--font-size) * 2.50)',
        '2xs': 'calc(var(--font-size) * 0.25)',
        '3xl': 'calc(var(--font-size) * 3.00)',
        '4xl': 'calc(var(--font-size) * 3.50)',
        '5xl': 'calc(var(--font-size) * 4.00)',
        base: 'calc(var(--font-size) * 1.00)',
        lg: 'calc(var(--font-size) * 1.50)',
        sm: 'calc(var(--font-size) * 0.75)',
        xl: 'calc(var(--font-size) * 2.00)',
        xs: 'calc(var(--font-size) * 0.50)',
      },

      /**
       * Allow **only** the scale of `--unit` which is the unit of measurement in a slyde HTML document as it changes
       * based on the size of the document. All other measurements don't.
       */
      spacing: Object.fromEntries(
        Array.from({ length: 1000 }, (_ignore, amount) => [amount, `calc(${amount} * var(--unit))`])
      ),
    },
  };
};

/** Returns a base Tailwind CSS style block that sets default styles. */
export const baseTailwind = function baseTailwind(): string {
  // eslint-disable-next-line no-inline-comments
  return /*HTML*/ `
    <style type="text/tailwindcss">
      @layer base {
        a { @apply text-secondary; }
        a:hover { @apply underline; }
      }
    </style>
  `;
};

// eslint-disable-next-line no-inline-comments
const htmlConfig = /*CSS*/ `
  html {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    font-family: "DejaVu Sans", sans-serif !important;
  }
`;

// eslint-disable-next-line no-inline-comments
const nothingSelectable = /*CSS*/ `
  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
`;

// eslint-disable-next-line no-inline-comments
const noScrollBars = /*CSS*/ `
  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  *::-webkit-scrollbar {
    display: none;
  }
`;

// eslint-disable-next-line no-inline-comments
const doNotDisplayListCss = /*CSS*/ `
  head, style, script {
    display: none !important;
  }
`;

// eslint-disable-next-line no-inline-comments
const latexLibStyling = /*CSS*/ `
  mjx-container { 
    display: inline-block;
    vertical-align: middle;
  }
`;

const setVarsBodyCss = function setVarsBodyCss({
  background,
  foreground,
  primary,
  secondary,
  size,
}: SlydeHtmlDocumentCssProperties): string {
  // eslint-disable-next-line no-inline-comments
  return /*CSS*/ `
    /*
     !!!! Any changes to this function are very much breaking changes !!!!
     */
    body { 
      --width: ${size.width} !important;
      --height: ${size.height} !important;
      --foreground: ${foreground} !important;
      --background: ${background} !important;
      --secondary: ${secondary} !important;
      --primary: ${primary} !important;
    }
  `;
};

const fontSize = 1;

// eslint-disable-next-line no-inline-comments
const bodyCss = /*CSS*/ `
  /* CSS to always apply to the body */
  body {
    color: var(--foreground);
    position: relative;
    
    --unit: min(
      (min(100vw, calc(100vh * var(--width) / var(--height))) / var(--width)),
      (min(100vh, calc(100vw * var(--height) / var(--width))) / var(--height)),
    ) !important;

    container-name: document;
    container-type: size;
    width: calc(var(--width) * var(--unit));

    /* This is not perfect, it needs some more min-max-math-ing */
    --font-size: min(
      ${fontSize} * 1vw * (100 / var(--width)), 
      100vh * (${fontSize} / var(--height))
    ) !important;
    font-size: var(--font-size);
  }

  body:not(.pdf) {
    overflow: hidden;
    aspect-ratio: var(--width) / var(--height);
    height: min(100vh, calc(100vw * var(--height) / var(--width)));
  }
  
  body.pdf {
    overflow-x: scroll;
    height: 100vh;
  }
`;

// eslint-disable-next-line no-inline-comments
const slideCss = /*CSS*/ `
  
  body slyde-component[level="${Component.level.slide}"] {
    display: block;
    background-color: var(--background);
    margin-bottom: var(--unit);
    width: 100%;
    aspect-ratio: var(--width) / var(--height);
  }

  body:not(.pdf) slyde-component[level="${Component.level.slide}"] {
    display: none;
  }
  
  /* Move to a separate style element later to allow JS to alter it. */
  body:not(.pdf) slyde-component[level="${Component.level.slide}"]:first-of-type {
    display: block;
  }

  body slyde-component[level="${Component.level.slide}"]:last-child {
    margin-bottom: 0;
  }
`;

/** The only part of the CSS that cannot be done using TailWindCss. */
export const baseCSS = function baseCSS(args: SlydeHtmlDocumentCssProperties): string {
  // eslint-disable-next-line no-inline-comments
  return /*CSS*/ `
    ${htmlConfig}
    ${nothingSelectable}
    ${noScrollBars}
    ${doNotDisplayListCss}
    ${latexLibStyling}
    ${setVarsBodyCss(args)}
    ${bodyCss}
    ${slideCss}
  `;
};
