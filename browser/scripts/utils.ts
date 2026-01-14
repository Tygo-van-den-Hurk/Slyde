import { Logger } from '#lib/logger';

let script = '"use-strict";';

/** Toggles between full screen and normal web page mode. */
export const toggleFullScreen = function toggleFullScreen(): void {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch((error: unknown) => {
      Logger.error(error);
    });
  } else {
    document.documentElement
      .requestFullscreen()
      .then(() => {
        Logger.info('Received full screen permissions, press `ESC` to exit.');
      })
      .catch((error: unknown) => {
        Logger.error(error);
      });
  }
};

script += `window.${toggleFullScreen.name} = ${toggleFullScreen.toString()};\n`;

declare global {
  interface Window {
    /** Checks if the document is supposed to viewed as a PDF. */
    toggleFullScreen: typeof toggleFullScreen;
  }
}

/** The util script tag contents. */
export default script; // eslint-disable-line import/no-default-export
