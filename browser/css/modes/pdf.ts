/**
 * This file contains all the CSS to ONLY apply when the document is in "PDF" mode.
 */
//

import { Component } from '#lib/core/components/class';

/** The CSS for the body. */
// eslint-disable-next-line no-inline-comments
const body = /*CSS*/ `
  body {
    overflow: hidden;
    height: 100vh;
  }
` as const;

// eslint-disable-next-line no-inline-comments
const slide = /*CSS*/ `
  body slyde-component[level="${Component.level.slide}"] {
    margin-bottom: var(--unit);
  }

  body slyde-component[level="${Component.level.slide}"]:last-child {
    margin-bottom: 0;
  }
` as const;

/** The CSS to apply when in this mode */
export const pdfModeStyle = `${body}${slide}`;
