import * as FileSystem from 'fs';
import * as path from 'path';
import * as url from 'url';
import parseXML, {
  type XmlParserDocumentChildNode,
  type XmlParserElementChildNode,
  type XmlParserElementNode,
  type XmlParserResult,
} from 'xml-parser-xo';
import { Component } from '#lib/core/components/index';
import { Logger } from '#lib/logger';
import { MarkupRenderer } from '#lib/core/markup/index';

/**
 * Given an XML `XmlParserElementNode` filters out text elements that when trimmed are blank.
 * Merges text xml elements when they next to each other.
 */
export const cleanAndMergeAdjacentTextNodesRecurse = function cleanAndMergeAdjacentTextNodesRecurse(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  input: XmlParserElementNode
): XmlParserElementNode {
  const children: XmlParserElementChildNode[] = [];

  input.children ??= [];
  for (let index = 0; index < input.children.length; index += 1) {
    const child = input.children[index];
    if (child.type === 'Comment') children.push(child);
    else if (child.type === 'CDATA') children.push(child);
    else if (child.type === 'ProcessingInstruction') children.push(child);
    else if (child.type === 'Element') children.push(cleanAndMergeAdjacentTextNodesRecurse(child));
    else {
      let merged = child.content.trim();
      let next: undefined | XmlParserElementChildNode = input.children[index + 1];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
      while (next) {
        if (next.type !== 'Text') break;
        merged += ` ${next.content.trim()}`;
        index += 1;
        next = input.children[index + 1];
      }

      if (merged.trim().length > 0)
        children.push({
          content: merged,
          type: 'Text',
        });
    }
  }

  input.children = children;
  return input;
};

/**
 * Given an XML `XmlParserResult` filters out text elements that when trimmed are blank.
 * Merges text xml elements when they next to each other.
 */
export const cleanAndMergeAdjacentTextNodes = function cleanAndMergeAdjacentTextNodes(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  input: XmlParserResult
): XmlParserResult {
  const root = cleanAndMergeAdjacentTextNodesRecurse(input.root);

  const filterMap = function filterMap(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    child: XmlParserDocumentChildNode
  ): XmlParserDocumentChildNode {
    // Replace our original ref to root, to the new root.
    if (child.type === 'Element') return root;
    return child;
  };

  const children: XmlParserDocumentChildNode[] = input.children.map(filterMap);
  return { ...input, children, root };
};

/**
 * Parses a given string for XML, and returns the parsed result.
 */
export const parseInput = function parseInput(content: string): XmlParserResult {
  try {
    const strictMode = true;
    const result = parseXML(content, { strictMode });
    const cleaned = cleanAndMergeAdjacentTextNodes(result);
    return cleaned;
  } catch (error: unknown) {
    // Because `ParsingError` from `xml-parser-xo` is undefined at runtime we have this:
    if (error instanceof Error && 'cause' in error && typeof error.cause === 'string')
      throw new Error(`${error.message}: ${error.cause}`, { cause: error });
    throw new Error(`Could not parse input file.`, { cause: error });
  }
};

/**
 * Given a path to a file, checks it for existence, accessability and type. Then reads and returns it.
 */
export const readInput = function readInput(filePath: string): string | never {
  const resolved = path.resolve(filePath);

  if (!FileSystem.existsSync(resolved)) {
    throw new Error(`No such file: ${resolved}`);
  }

  const extension = path.extname(resolved);
  if (extension !== '.xml') {
    Logger.warn(`Expected an '.xml' file, but got a ${extension} file: ${resolved}`);
  }

  try {
    FileSystem.accessSync(resolved, FileSystem.constants.R_OK);
  } catch (error: unknown) {
    throw new Error(`File is not accessible for reading: ${resolved}`, { cause: error });
  }

  try {
    const content = FileSystem.readFileSync(resolved);
    return content.toString();
  } catch (error: unknown) {
    throw new Error(`Could not read: ${resolved}`, { cause: error });
  }
};

/**
 * Given a path to a file, checks it for existence, accessability and type. Then reads and imports it.
 */
const importPlugin = async function importPlugin(resolved: string): Promise<unknown> {
  if (!FileSystem.existsSync(resolved)) {
    throw new Error(`No such file: ${resolved}`);
  }

  const expected = ['.js', '.mjs'];
  const extension = path.extname(resolved);
  if (!expected.includes(extension)) {
    Logger.warn(
      `Expected plugin to be one of '${expected.join("', '")}', but got a '${extension}' file: ${resolved}`
    );
  }

  try {
    const plugin = url.pathToFileURL(resolved).href;
    return (await import(plugin)) as unknown;
  } catch (error: unknown) {
    throw new Error(`Could not import plugin: ${resolved}`, { cause: error });
  }
};

/**
 * Imports a file path, and parses the exports for the desired structure.
 */
const loadPlugin = async function loadPlugin(filePath: string): Promise<void> {
  const resolved = path.resolve(filePath);

  const result = await importPlugin(resolved);
  if (typeof result !== 'object' || result === null)
    throw new Error(`Expected plugin' exports to be an object, but found ${String(result)}`);
  if (!('default' in result))
    throw new Error(
      `Expected plugin' exports to have a default key, but found keys: "${Object.keys(result).join('", "')}"`
    );
  if (typeof result.default !== 'function')
    throw new Error(
      `Expected plugin' default exports to be a function but found: "${typeof result.default}"`
    );

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await result.default({ Component, Logger: Logger.API, MarkupRenderer });
    Logger.info(`Successfully loaded plugin: ${resolved}`);
  } catch (error: unknown) {
    throw new Error(`Could not load plugin' default function: ${resolved}`, { cause: error });
  }
};

/**
 * Imports all imports from a list of imports.
 */
export const loadPlugins = async function loadPlugins(plugins: readonly string[]): Promise<void> {
  await Promise.all(plugins.map(async (plugin) => loadPlugin(plugin)));
};
