import { Logger } from '#lib/logger';
import { pdfModeStyle } from '#browser/css/modes/pdf';
import { presentationModeStyle } from '#browser/css/modes/presentation';

let script = '"use-strict";\n';

if (pdfModeStyle.includes('`'))
  throw new Error(`Build mistake: pdfModeStyle cannot include \` char.`);
script += `const pdfModeStyle = \`${pdfModeStyle}\`;\n`;

if (presentationModeStyle.includes('`'))
  throw new Error(`Build mistake: presentationModeStyle cannot include \` char.`);
script += `const presentationModeStyle = \`${presentationModeStyle}\`;\n`;

interface isPdfFunction {
  (state?: boolean): boolean;
  readonly state: boolean;
}

/** Checks if the document is supposed to viewed as a PDF. */
// @ts-expect-error this is intentional, the `.state` property does exist.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unsafe-assignment
export const isPDF = function isPDF(state = isPDF.state ?? false): boolean {
  const ref = isPDF as isPdfFunction; // eslint-disable-line @typescript-eslint/no-unsafe-type-assertion

  if (ref.state === state) return ref.state;
  (ref as { state: boolean }).state = state;

  const styleSheet = document.getElementById('dynamic-style');
  if (!styleSheet) throw new Error(`Missing dynamic style sheet.`);

  if (ref.state) {
    Logger.info(`Turning PDF mode on.`);
    styleSheet.textContent = pdfModeStyle;
  } else {
    Logger.info(`Turning PDF mode off.`);
    styleSheet.textContent = presentationModeStyle;
  }

  return ref.state;
} as isPdfFunction;

script += `window.${isPDF.name} = ${isPDF.toString()};\n`;

declare global {
  interface Window {
    /** Checks if the document is supposed to viewed as a PDF. */
    isPDF: typeof isPDF;
  }
}

/** Toggles PDF mode, triggers on a `slyde:mode:pdf:toggle` event. */
export const togglePdfMode = function togglePdfMode(): void {
  window.isPDF(!isPDF.state);
};

script += `window.${togglePdfMode.name} = ${togglePdfMode.toString()};\n`;
script += `window.addEventListener("slyde:mode:pdf:toggle", window.${togglePdfMode.name});\n`;

declare global {
  interface Window {
    togglePdfMode: typeof togglePdfMode;
  }
}

/** Toggles PDF mode, triggers on a `slyde:mode:pdf:on` event. */
export const turnPdfModeOnEventCallback = function turnPdfModeOnEventCallback(): void {
  window.isPDF(true);
};

script += `window.addEventListener("slyde:mode:pdf:on", ${turnPdfModeOnEventCallback.toString()});\n`;

/** Toggles PDF mode, triggers on a `slyde:mode:pdf:off` event. */
export const turnPdfModeOffEventCallback = function turnPdfModeOffEventCallback(): void {
  window.isPDF(false);
};

script += `window.addEventListener("slyde:mode:pdf:off", ${turnPdfModeOffEventCallback.toString()});\n`;

/** The callback to exec when the window loads and we can set the PDF type. */
export const onWindowPdfModeCallback = function onWindowPdfModeCallback(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.has('pdf')) isPDF(true);
  if (params.has('type', 'pdf')) isPDF(true);
};

script += `window.addEventListener("load", ${onWindowPdfModeCallback.toString()});\n`;

/** The JavaScript to inject in relation to PDF mode. */
export default script; // eslint-disable-line import/no-default-export
