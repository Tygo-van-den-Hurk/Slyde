/* eslint-disable no-inline-comments */

import { Component } from '#lib/core/components/class';
import type { SlydeHtmlDocumentCssProperties } from '#browser/css/types';

/** Passes the provided arguments as CSS variables up the tree. */
export const variables = function variables({
  background,
  foreground,
  primary,
  secondary,
  size,
}: SlydeHtmlDocumentCssProperties): string {
  return /*CSS*/ `
    /*
     !!!! Any changes to this function removing variables are very much breaking changes !!!!
     */
    :root { 
      --width: ${size.width} !important;
      --height: ${size.height} !important;
      --foreground: ${foreground} !important;
      --background: ${background} !important;
      --secondary: ${secondary} !important;
      --primary: ${primary} !important;
    }
  `;
};

/** All the CSS for the HTML body. */
export const html = /*CSS*/ `
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

/** Disables all scrollbars everywhere */
const scrollBars = /*CSS*/ `
  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  *::-webkit-scrollbar {
    display: none;
  }
`;

/** A list of things that should never be displayed. */
const hide = /*CSS*/ `
  head, style, script {
    display: none !important;
    visibility: hidden !important;
  }
`;

/** Styles the latex containers created by the latex parsers. */
const latex = /*CSS*/ `
  mjx-container { 
    display: inline-block;
    vertical-align: middle;
  }
`;

const fontSize = 1;

/** The CSS related to the body. */
const body = /*CSS*/ `
  body { /* Calculation of --unit */
    color: var(--foreground);
    position: relative;
    
    --unit: min(
      (min(100vw, calc(100vh * var(--width) / var(--height))) / var(--width)),
      (min(100vh, calc(100vw * var(--height) / var(--width))) / var(--height)),
    ) !important;

    container-name: document;
    container-type: size;
    width: calc(var(--width) * var(--unit));
  }
  
  body { /* Calculation of the --font size. */
    --font-size: min(
      ${fontSize} * 1vw * (100 / var(--width)), 
      100vh * (${fontSize} / var(--height))
    ) !important;
    font-size: var(--font-size);
  }
`;

/** CSS related to the slides */
const slide = /*CSS*/ `
  body slyde-component[level="${Component.level.slide}"] {
    display: block;
    background-color: var(--background);
    width: 100%;
    aspect-ratio: var(--width) / var(--height);
  }
`;

/** CSS related to anchors */
const anchors = /*CSS*/ `
  a { color: var(--secondary) }
  a:hover { text-decoration: underline }
`;

/** The default CSS to display regardless of the mode we're in. */
export const baseCSS = function baseCSS(args: SlydeHtmlDocumentCssProperties): string {
  return /* CSS */ `
    ${variables(args)}
    ${html}
    ${scrollBars}
    ${hide}
    ${latex}
    ${body}
    ${slide}
    ${anchors}
  `;
};
