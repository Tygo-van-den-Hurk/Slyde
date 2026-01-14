import type { SlydeHtmlDocumentCssProperties } from '#browser/css/types';

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
