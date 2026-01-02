import type { Attribute, RenderState } from '#lib/core/render/types';
import type { DeepReadonly } from '#lib/types';
import { Logger } from '#lib/logger';
import type { XmlParserProcessingInstructionNode } from 'xml-parser-xo';
import { getAttributes } from '#lib/core/render/utils';

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

    // Not implemented processing-instructions/concepts.
    case 'engine':
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
