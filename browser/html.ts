import type { SlydeHtmlDocumentCssProperties } from '#browser/css/types';
import { baseCSS } from '#browser/css/modes/base';
import inputBindingScript from '#browser/scripts/input-bindings';
import pdfModeScript from '#browser/scripts/pdf-mode';
import { pdfModeStyle } from '#browser/css/modes/pdf';
import slideControlScript from '#browser/scripts/slide-control';
import { tailwindConfig } from '#browser/css/tw-config';
import utilsScript from '#browser/scripts/utils';

/** The properties a  */
export interface SlydeHtmlDocumentHtmlProperties extends SlydeHtmlDocumentCssProperties {
  /** The title of the presentation. */
  readonly title: string;
  /** The people presenting the presentation. */
  readonly authors: readonly string[];
  /** The icon the presentation. */
  readonly icon: string;
  /** The description of this presentation. */
  readonly description: string;
  /** The keywords of this presentation. */
  readonly keywords: readonly string[];
  /** The background color of this presentation. */
  readonly background: string;
  /** The foreground color of this presentation. */
  readonly foreground: string;
  /** The nonce of this document. restricts what JS can run in this document if provided. */
  readonly nonce?: string;
  /** The content of this document. */
  readonly content: string;
}

/** Creates an HTML document from  */
export const htmlDocument = function htmlDocument(args: SlydeHtmlDocumentHtmlProperties): string {
  // eslint-disable-next-line no-inline-comments
  return /*HTML*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${args.title}</title>
        <!-- TODO: wget this script and then inject it as a string instead. -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script id="tailwind-config-setup"> tailwind.config = ${JSON.stringify(tailwindConfig({ ...args }))}; </script>
        <script> const Logger = Object.freeze({ ...console, critical: console.error }); </script>
        <script type="module">${utilsScript}</script>
        <script type="module">${slideControlScript}</script>
        <script type="module">${pdfModeScript}</script>
        <script type="module">${inputBindingScript}</script>
        <meta charset="UTF-8">
        <meta name="darkreader-lock">
        <meta property="og:title" content="${args.title}">
        <meta property="og:description" content="${args.description}">
        <meta property="og:image" content="${args.icon}">
        <meta name="keywords" content="${args.keywords.join(',')}">
        <meta name="description" content="${args.description}">
        <meta name="authors" content="${args.authors.join(',')}">
        <meta name="msapplication-TileImage" content="${args.icon}" />
        <meta name="msapplication-TileColor" content="${args.background}" />
        <!-- <meta http-equiv="Content-Security-Policy" content="connect-src 'none'; script-src 'self' ${((args.nonce ?? '') !== '' && `'nonce-${args.nonce}'`) || ''};"> -->
        <meta name="theme-color" content="${args.primary}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link rel="icon" href="${args.icon}">
        <link rel="apple-touch-icon" href="${args.icon}">    
        <style> ${baseCSS({ ...args })} </style>
        <style id="dynamic-style">${pdfModeStyle}</style>
        <noscript><style id="pdf-mode-style">${pdfModeStyle}</style></noscript>
      </head>
      <body>
        ${args.content}
      </body>
    </html>
  `;
};
