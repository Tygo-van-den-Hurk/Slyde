import * as semanticVersion from 'semver';
import type { Attribute, RenderState } from '#lib/core/render/types';
import type { DeepReadonly } from '#lib/types';
import { Logger } from '#lib/logger';
import type { XmlParserProcessingInstructionNode } from 'xml-parser-xo';
import { getAttributes } from '#lib/core/render/utils';
import pkg from '#package' with { type: 'json' };

/**
 * Processes an engine processing instruction. These instructions compare the current engine with an engine range.
 * if it is not in that range, we print a warning. The interface and syntax of a valid range depends completely on
 * the `semver` npm package.
 */
export const useEngineInstruction = function useEngineInstruction(
  state: RenderState,
  instruction: Attribute
): RenderState {
  const range = semanticVersion.validRange(instruction.value);

  if (range === null) {
    Logger.warn(`The semantic version range "${instruction.value}" is not a valid range.`);
    Logger.warn(`This problematic processing instruction was near: ${state.path}`);
    return state;
  }

  if (!semanticVersion.satisfies(pkg.version, range)) {
    Logger.warn(`Engine version ${pkg.version} does not satisfy "${range}".`);
    Logger.warn(`This problematic processing instruction was near: ${state.path}`);
    return state;
  }

  return state;
};

/** Consumes a processing instruction possibly modifying the state with it. */
export const useProcessingInstruction = function useProcessingInstruction(
  state: RenderState,
  instruction: Attribute | DeepReadonly<XmlParserProcessingInstructionNode>
): RenderState {
  if ('type' in instruction) {
    const instructions = getAttributes(instruction.content);
    return instructions.reduce(useProcessingInstruction, state);
  }

  switch (instruction.name.toLowerCase()) {
    // Change the markup renderer
    case 'markup':
      return { ...state, markup: instruction.value };

    // Compare the required engine with this engine.
    case 'engine':
      return useEngineInstruction(state, instruction);

    // Not implemented processing-instructions/concepts.
    case 'transition':
    case 'include':
      Logger.warn(`Processing instruction "${instruction.name}" has not been implemented yet.`);
      Logger.warn(`They may never be implemented, please do not use them expecting a result.`);
      return state;

    // Unknown procession instructions.
    default:
      Logger.warn(`Unknown processing instruction: ${instruction.name}="${instruction.value}"`);
      return state
  }
};
