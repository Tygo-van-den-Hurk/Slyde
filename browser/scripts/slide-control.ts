import type { DeepReadonly } from '#lib/types';
import { Logger } from '#lib/logger';

let script = '"use-strict";\n';

/**
 * The Regex the Hash will comply with.
 */
export const regex = /^#slide-(?<slide>\d+)/iu;

script += `let regex = ${regex.toString()};\n`;

/**
 * Sets the browsers location hash (the `#id` part) to the given index.
 */
export const setCurrentSlideUrlHash = function setCurrentSlideUrlHash(index: number): void {
  window.location.hash = `slide-${index}`;
};

script += `${setCurrentSlideUrlHash.toString()};\n`;

/**
 * Gets the browser's location hash and returns the slide index. If `allowMissing` is true,
 * returns `number | undefined` when no slide is found; otherwise, throws an error.
 *
 * **Example**
 * ```TypeScript
 * // throws an error
 * window.location.hash = "#slide-a";
 * getCurrentSlideUrlHash();
 *
 * // returns null
 * window.location.hash = "#slide-a";
 * getCurrentSlideUrlHash({ allowMissing: true });
 *
 * // returns the number 1
 * window.location.hash = "#slide-1";
 * getCurrentSlideUrlHash({ ... });
 * ```
 *
 * Used to control the page's slide index.
 */
export function getCurrentSlideUrlHash(): number;
export function getCurrentSlideUrlHash({
  allowMissing,
}: {
  readonly allowMissing: true;
}): number | null;
export function getCurrentSlideUrlHash({
  allowMissing = false,
}: {
  readonly allowMissing?: boolean;
} = {}): number | null {
  const match = regex.exec(window.location.hash);

  if (!match?.groups) {
    if (allowMissing) return null;
    throw new Error(
      `Expected window.location.hash to be of the form ${regex}, but found ${window.location.hash}.`
    );
  }

  const { slide } = match.groups;
  return Number.parseInt(slide, 10);
}

script += `${getCurrentSlideUrlHash.toString()};\n`;

/** Goes to the next slide. */
export const goToNextSlide = function goToNextSlide(): void {
  const currentSlide = getCurrentSlideUrlHash();
  const nextSlide = currentSlide + 1;
  Logger.info(`Going to the next slide: ${nextSlide}`);
  setCurrentSlideUrlHash(nextSlide);
};

script += `window.${goToNextSlide.name} = ${goToNextSlide.toString()};\n`;
script += `window.addEventListener("slyde:next", window.${goToNextSlide.name});\n`;

declare global {
  interface Window {
    goToNextSlide: typeof goToNextSlide;
  }
}

/** Goes to the previous slide. */
export const goToPreviousSlide = function goToPreviousSlide(): void {
  const currentSlide = getCurrentSlideUrlHash();
  const previousSlide = currentSlide - 1;

  if (previousSlide < 1) {
    Logger.warn(`At the start of the presentation, cannot go back further.`);
    return;
  }

  Logger.info(`Going to the previous slide: ${previousSlide}`);
  setCurrentSlideUrlHash(previousSlide);
};

script += `window.${goToPreviousSlide.name} = ${goToPreviousSlide.toString()};\n`;
script += `window.addEventListener("slyde:prev", window.${goToNextSlide.name});\n`;

declare global {
  interface Window {
    goToPreviousSlide: typeof goToPreviousSlide;
  }
}

/**
 * The callback to exec when the window has loaded to ensure that a hash slide is set.
 */
export const setupUrlHashCallBack = function setupUrlHashCallBack(): void {
  const currentSlide = getCurrentSlideUrlHash({ allowMissing: true });
  if (currentSlide === null) setCurrentSlideUrlHash(1);
};

script += `window.addEventListener("load", ${setupUrlHashCallBack.toString()});\n`;

/** Gets the size of one `--unit` in pixels. */
export const getUnit = function getUnit(): number {
  const element = document.createElement('div');
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';
  element.style.height = 'var(--unit)';
  document.body.appendChild(element);
  const pixels = element.getBoundingClientRect().height;
  document.body.removeChild(element);
  return pixels;
};

script += `const ${getUnit.name} = ${getUnit.toString()};\n`;

/** Scrolls the window down by `amount * --unit` in pixels. */
export const scrollDownToSlide = function scrollDownToSlide(slide: number): void {
  const indexing = 1,
    margin = 1,
    unit = getUnit();
  const heightStr = getComputedStyle(document.body).getPropertyValue('--height').trim();
  const height = Number.parseFloat(heightStr);
  const pixels = unit * (height + margin) * (slide - indexing);
  if (Number.isNaN(pixels)) {
    throw new Error(
      `Cannot scroll by ${pixels} pixels: margin=${margin}, height=${height}, unit=${unit}, slides=${slide};`
    );
  }

  Logger.debug(`Scrolling down to ${pixels} pixels`);
  document.body.scrollTo({ behavior: 'smooth', left: 0, top: pixels });
};

script += `const ${scrollDownToSlide.name} = ${scrollDownToSlide.toString()};\n`;

declare global {
  interface Window {
    scrollDownToSlide: typeof scrollDownToSlide;
  }
}

/**
 *  Watches for changes in the hash of the URL (the # part), and resets the hash if it is incorrect.
 */
export const handleUrlHashChange = function handleUrlHashChange(
  event: DeepReadonly<HashChangeEvent>
): void {
  const oldUrl = new URL(event.oldURL);
  const newURL = new URL(event.newURL);
  const match = regex.exec(newURL.hash);

  if (!match?.groups) {
    let message = `The new URL hash: ${newURL.hash} does not have a hash of the right shape: ${regex}.`;
    message += `Resetting it to the old value of ${oldUrl.hash}`;
    Logger.warn(message);
    history.replaceState(null, '', event.oldURL);
  }

  if (window.isPDF()) {
    const slide = getCurrentSlideUrlHash();
    Logger.debug(`in PDF mode, scrolling down to slide ${slide}`);
    scrollDownToSlide(slide);
  }
};

script += `window.addEventListener("hashchange", ${handleUrlHashChange.toString()});\n`;

/** The contents of a the slide control script. */
export default script; // eslint-disable-line import/no-default-export
