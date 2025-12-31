import { promises as FileSystem } from 'fs';
import { Logger } from '#lib/logger';
import path from 'path';

/**
 * Converts an (file) extension into a mime type.
 */
export const mimeMap: Record<string, string | undefined> = Object.freeze({
  avi: 'video/x-msvideo',
  bmp: 'image/bmp',
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  htm: 'text/html',
  html: 'application/rtf',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  json: 'application/json',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  ogg: 'audio/ogg',
  pdf: 'application/pdf',
  png: 'image/png',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  rtf: 'application/rtf',
  svg: 'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  txt: 'text/plain',
  wav: 'audio/wav',
  webm: 'video/webm',
  webp: 'image/webp',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml: 'application/xml',
});

/**
 * Converts an (file) extension into a mime type.
 */
export const toMime = function toMime(extension: string): string {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (mimeMap[extension]) return mimeMap[extension];
  throw new Error(`Unknown extension: ${extension}. Could not convert to a mime type.`);
};

/**
 * Convert local file to Data URL by reading it from disk and then encoding the content.
 */
export const fileToDataURL = async function fileToDataURL(filePath: string): Promise<string> {
  const buffer = await FileSystem.readFile(filePath);
  const extension = filePath.split('.').pop() ?? 'unknown';
  const mime = toMime(extension);
  Logger.debug(`Read ${filePath} from disk and converted it to a data URL.`);
  return `data:${mime};base64,${buffer.toString('base64')}`;
};

/**
 * Convert remote URL to Data URL by downloading and encoding the content.
 */
export const urlToDataURL = async function urlToDataURL(url: string): Promise<string> {
  const responds = await fetch(url);
  const buffer = Buffer.from(await responds.arrayBuffer());

  const contentType = responds.headers.get('content-type');
  if (contentType === null) {
    throw new Error(
      `Responds of ${url} did not return a mime type, but this is required to encode the remote content.`
    );
  }

  Logger.debug(`Fetched remote content from ${url} and converted it to a data URL.`);
  return `data:${contentType};base64,${buffer.toString('base64')}`;
};

/**
 * Converts a path or URL to a Data URL by reading it from disk or fetching the remote content and then encoding
 * the content. Does require a mime type of some type to be found, or it will throw. Assumes the base directory
 * read from is the current working directory.
 */
export const toDataURL = async function toDataURL(
  input: string,
  base: string = process.cwd()
): Promise<string> {
  if (/^data:/iu.test(input)) return input;
  if (/^https?:\/\//iu.test(input)) return urlToDataURL(input);

  let resolvedPath; // eslint-disable-line @typescript-eslint/init-declarations
  if (path.isAbsolute(input)) resolvedPath = input;
  else resolvedPath = path.resolve(base, input);

  const isFileOnDisk = await FileSystem.stat(resolvedPath)
    .then(() => true)
    .catch(() => false);

  if (isFileOnDisk) {
    return fileToDataURL(resolvedPath);
  }

  throw new Error(
    `Expected either a valid URL or an existing file path, but found neither: ${input} (resolved as: ${resolvedPath})`
  );
};

/** Extracts a key from a record even if it has aliases, or returns a fallback. */
export function extract({
  record,
  aliases,
  fallback,
}: {
  readonly record: Readonly<Record<string, string | undefined>>;
  readonly aliases: readonly string[];
  readonly fallback: string;
}): string;

/** Extracts a key from a record even if it has aliases, or returns a fallback. */
export function extract({
  record,
  aliases,
}: {
  readonly record: Readonly<Record<string, string | undefined>>;
  readonly aliases: readonly string[];
}): string | undefined;

/** Extracts a key from a record even if it has aliases, or returns a fallback. */
export function extract({
  record,
  aliases,
  fallback,
}: {
  readonly record: Readonly<Record<string, string | undefined>>;
  readonly aliases: readonly string[];
  readonly fallback?: string;
}): string | undefined {
  for (const alias of aliases) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (record[alias]) {
      return record[alias];
    }
  }
  return fallback;
}
