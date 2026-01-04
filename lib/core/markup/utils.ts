/**
 * Removes the 'Please report this to https://github.com/markedjs/marked.' message at the end of errors from marked
 */
export const wrapMarkedError = function wrapMarkedError(error: unknown): Error {
  if (error instanceof Error) {
    [error.message] = error.message.split('\n');
    return error;
  }

  if (typeof error === 'string') {
    const [message] = error.split('\n');
    return new Error(message, { cause: error });
  }

  throw error;
};
