import { Logger } from '#lib/logger';

let script = '"use-strict";\n';

/** Handles key presses on the document, and moves slides accordingly. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, complexity
export const handleKeyPresses = function handleKeyPresses(event: KeyboardEvent): void {
  event.preventDefault();
  Logger.warn(event);
  switch (event.key) {
    // Moving to the next slide:
    case 'Enter':
    case 'Space':
    case 'Tab':
    case ' ':
    case 'd':
    case 'D':
    case 'l':
    case 'L':
    case 'ArrowRight':
      if (window.isPDF()) break;
    case 'ArrowDown': // eslint-disable-line no-fallthrough
    case 'PageDown':
      window.goToNextSlide();
      break;

    // Moving to the previous slide:
    case 'a':
    case 'A':
    case 'h':
    case 'H':
    case 'ArrowLeft':
      if (window.isPDF()) break;
    case 'ArrowUp': // eslint-disable-line no-fallthrough
    case 'PageUp':
      window.goToPreviousSlide();
      break;

    // Making the presentation full screen
    case 'f':
    case 'F':
    case 'F11':
      window.toggleFullScreen();
      break;

    // Toggling PDF mode
    case 'p':
    case 'P':
      window.togglePdfMode();
      break;

    // Ignore unknown keybindings.
    default:
  }
};

script += `window.addEventListener("keydown", ${handleKeyPresses.toString()});\n`;

/** Handles scrolling through on the document, and moves slides accordingly. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleScrollEvents = function handleScrollEvents(event: WheelEvent): void {
  if (!(event.target instanceof Node)) return;
  if (!document.body.contains(event.target)) {
    Logger.debug(`Node ${event.target.nodeName} is outside of body, ignoring scroll.`);
    return;
  }

  event.preventDefault();

  const min = 50;
  const intensity = Math.abs(event.deltaY);
  if (intensity < min) {
    Logger.debug(`Intensity ${intensity} not heigh enough to trigger slide movement`);
    return;
  }

  if (event.deltaY < 0) window.goToNextSlide();
  else window.goToPreviousSlide();
};

script += `window.addEventListener("wheel", ${handleScrollEvents.toString()});\n`;

/**
 * Handles touch events the screen. Goes to the next slide, when tapping the right half,
 * and the previous slide when tapping the left half of the screen.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleTouchEvents = function handleTouchEvents(event: TouchEvent): void {
  if (window.isPDF()) return;

  const half = 2;
  const screenWidth = window.innerWidth;
  for (const touch of event.touches) {
    // Ignoring touches outside of the presentation, or are not on document nodes.
    const { target } = touch;
    if (!(target instanceof Node)) continue;
    if (!document.body.contains(target)) continue;
    if (target === document.documentElement) continue;

    if (touch.clientX > screenWidth / half) window.goToNextSlide();
    else window.goToPreviousSlide();
  }
};

script += `window.addEventListener("touch", ${handleScrollEvents.toString()});\n`;

/** Prevents context menus from showing up when right clicking. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleContextMenus = function handleContextMenus(event: MouseEvent): void {
  if (window.isPDF()) return;
  event.preventDefault();
};

script += `window.addEventListener("contextmenu", ${handleContextMenus.toString()});\n`;

interface MouseHider {
  (): void;
  hideTimeout?: NodeJS.Timeout;
}

/** Hides mouse cursor when its not moving, shows the mouse cursor when it is. */
export const handleMouseMove = function handleMouseMove(): void {
  if (window.isPDF()) return;

  const ref = handleMouseMove as MouseHider;
  clearTimeout(ref.hideTimeout);
  document.documentElement.style.cursor = 'default';

  const oneSecond = 1000;
  ref.hideTimeout = setTimeout(() => {
    document.documentElement.style.cursor = 'none';
  }, oneSecond);
} as MouseHider;

script += `window.addEventListener("mousemove", ${handleMouseMove.toString()});\n`;

/** Handles mouse presses on the document, and moves slides accordingly. */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const handleMousePresses = function handleMousePresses(event: MouseEvent): void {
  if (window.isPDF()) return;

  // Letting the "handle touch" function handle clicks if they are on mobile.
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const leftClick = 0;
  if (event.button === leftClick) window.goToNextSlide();

  const rightClick = 2;
  if (event.button === rightClick) window.goToPreviousSlide();
};

script += `window.addEventListener("mousedown", ${handleMousePresses.toString()});\n`;

/** The contents of the input binding script. */
export default script; // eslint-disable-line import/no-default-export
