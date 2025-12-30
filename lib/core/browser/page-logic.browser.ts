import type { DeepReadonly } from '#lib/types';
import { Logger } from '#lib/logger';

/** Checks if the document is supposed to viewed as a PDF. */
export const isPDF = function isPDF(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.has('pdf')) return true;
  return params.has('type', 'pdf');
};

/** Adds enables the stacked layout in the body. */
export const setStackedLayout = function setStackedLayout(): void {
  if (!isPDF()) return;
  Logger.debug('is a PDF, forcing stacked layout.');
  document.body.classList.add('pdf');
};

/**
 * The Regex the Hash will comply with.
 */
export const regex = /^#slide-(?<slide>\d+)/iu;

/**
 * Sets the browsers location hash (the `#id` part) to the given index.
 */
export const setCurrentSlideUrlHash = function setCurrentSlideUrlHash(index: number): void {
  window.location.hash = `slide-${index}`;
};

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

/** Goes to the next slide. */
export const goToNextSlide = function goToNextSlide(): void {
  const currentSlide = getCurrentSlideUrlHash();
  const nextSlide = currentSlide + 1;
  Logger.info(`Going to the next slide: ${nextSlide}`);
  setCurrentSlideUrlHash(nextSlide);
};

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

/**
 * The callback to exec when the window has loaded to ensure that a hash slide is set.
 */
const setupUrlHashCallBack = function setupUrlHashCallBack(): void {
  const currentSlide = getCurrentSlideUrlHash({ allowMissing: true });
  if (currentSlide === null) setCurrentSlideUrlHash(1);
};

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
    return;
  }

  Logger.info(`Moved to: ${event.newURL}`);
};

/** Handles mouse presses on the document, and moves slides accordingly. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleMousePresses = function handleMousePresses(event: MouseEvent): void {
  if (isPDF()) return;

  // Letting the "handle touch" function handle clicks if they are on mobile.
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const leftClick = 0;
  if (event.button === leftClick) goToNextSlide();

  const rightClick = 2;
  if (event.button === rightClick) goToPreviousSlide();
};

/** Handles key presses on the document, and moves slides accordingly. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleKeyPresses = function handleKeyPresses(event: KeyboardEvent): void {
  if (isPDF()) return;

  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'd':
    case 'l':
    case 'ArrowRight':
      goToNextSlide();
      break;
    case 'a':
    case 'h':
    case 'ArrowLeft':
      goToPreviousSlide();
      break;
    default:
  }
};

/** Handles scrolling through on the document, and moves slides accordingly. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleScrollEvents = function handleScrollEvents(event: WheelEvent): void {
  if (isPDF()) return;

  if (event.deltaY < 0) goToNextSlide();
  if (event.deltaY > 0) goToPreviousSlide();
};

/**
 * Handles touch events the screen. Goes to the next slide, when tapping the right half,
 * and the previous slide when tapping the left half of the screen.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleTouchEvents = function handleTouchEvents(event: TouchEvent): void {
  if (isPDF()) return;

  const half = 2;
  const screenWidth = window.innerWidth;
  for (const touch of event.touches) {
    // Ignoring touches outside of the presentation, or are not on document nodes.
    const { target } = touch;
    if (!(target instanceof Node)) continue;
    if (!document.body.contains(target)) continue;
    if (target === document.documentElement) continue;

    if (touch.clientX > screenWidth / half) goToNextSlide();
    else goToPreviousSlide();
  }
};

let hideTimeout: NodeJS.Timeout | undefined; // eslint-disable-line @typescript-eslint/init-declarations

/** Hides mouse cursor when its not moving, shows the mouse cursor when it is. */
export const handleMouseMove = function handleMouseMove(): void {
  if (isPDF()) return;

  document.documentElement.style.cursor = 'default';

  clearTimeout(hideTimeout);

  const second = 1000;
  hideTimeout = setTimeout(() => {
    document.documentElement.style.cursor = 'none';
  }, second);
};

/** Prevents context menus from showing up when right clicking. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleContextMenus = function handleContextMenus(event: MouseEvent): void {
  if (isPDF()) return;
  event.preventDefault();
};

/** Adds a bunch of events listeners as setup. */
export const addEventListeners = function addEventListeners(): void {
  window.addEventListener('prev:slide', goToPreviousSlide);
  window.addEventListener('next:slide', goToNextSlide);
  window.addEventListener('load', setupUrlHashCallBack);
  window.addEventListener('load', setStackedLayout);
  window.addEventListener('hashchange', handleUrlHashChange);
  window.addEventListener('mousedown', handleMousePresses);
  window.addEventListener('keydown', handleKeyPresses);
  window.addEventListener('wheel', handleScrollEvents);
  window.addEventListener('touchstart', handleTouchEvents);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('contextmenu', handleContextMenus);
};

/** The full setup code to run when first opening the document */
// eslint-disable-next-line no-inline-comments
export const setupScriptCode = /*JavaScript*/ `
  "use strict";
  ${isPDF.toString()}
  ${setStackedLayout.toString()}
  let hideTimeout;
  ${handleMouseMove.toString()}
  const regex = ${regex.toString()};
  ${setCurrentSlideUrlHash.toString()}
  ${getCurrentSlideUrlHash.toString()}
  ${goToNextSlide.toString()}
  ${goToPreviousSlide.toString()}
  ${setupUrlHashCallBack.toString()}
  ${handleUrlHashChange.toString()}
  ${handleMousePresses.toString()}
  ${handleKeyPresses.toString()}
  ${handleScrollEvents.toString()}
  ${handleTouchEvents.toString()}
  ${handleContextMenus.toString()}
  (${addEventListeners.toString()})(); // Executes immediately.  
`;
