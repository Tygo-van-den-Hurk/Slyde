/**
 * This file contains all the CSS to only apply when the document is in it's default "presenting" mode.
 */
//

import { Component } from '#lib/core/components/class';

/** Makes nothing selectable. Prevents selecting things when presenting. */
// eslint-disable-next-line no-inline-comments
export const nothingSelectable = /*CSS*/ `
  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
` as const;

/** The CSS for the body */
// eslint-disable-next-line no-inline-comments
const body = /*CSS*/ `
  body {
    overflow: hidden;
    aspect-ratio: var(--width) / var(--height);
    /* Full height, unless it would be wider then the slide itself. */
    height: min(100vh, calc(100vw * var(--height) / var(--width)));
  }
` as const;

// eslint-disable-next-line no-inline-comments
const slide = /*CSS*/ `
  body slyde-component[level="${Component.level.slide}"] {
    display: none;
  }
  
  /* Move to a separate style element later to allow JS to alter it. */
  body slyde-component[level="${Component.level.slide}"]:first-of-type {
    display: block;
  }
` as const;

/** The CSS to apply when in presentation mode. */
export const presentationModeStyle = `
  ${nothingSelectable}
  ${slide}
  ${body}
` as const;
