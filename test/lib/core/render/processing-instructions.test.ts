import { Globals, type RenderState } from '#lib/core/render/types';
import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  useEngineInstruction,
  useProcessingInstruction,
} from '#lib/core/render/processing-instructions';
import { Logger } from '#lib/logger';
import { SlydeMarkupRenderer } from '#lib/core/markup/languages/slyde';
import type { XmlParserProcessingInstructionNode } from 'xml-parser-xo';

const warnSpy = vi.spyOn(Logger, 'warn').mockImplementation(() => {
  // We do nothing with any of the arguments...
});

// Mock package version
vi.mock('#package', () => ({ default: { version: '1.2.3' } }));

const baseState: RenderState = {
  globals: Globals.instance,
  id: 0,
  level: 0,
  markup: SlydeMarkupRenderer.name,
  notes: [],
  path: 'test path',
} satisfies RenderState;

describe('useEngineInstruction', () => {
  afterEach(() => warnSpy.mockReset());

  test('valid range and satisfies', () => {
    const state = useEngineInstruction(baseState, { name: 'engine', value: '>=1.0.0' });
    expect(state).toEqual(baseState);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('valid range but does not satisfy', () => {
    useEngineInstruction(baseState, { name: 'engine', value: '<1.0.0' });
    expect(warnSpy).toHaveBeenCalled();
  });

  test('invalid range', () => {
    useEngineInstruction(baseState, { name: 'engine', value: 'not-a-range' });
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('useProcessingInstruction', () => {
  afterEach(() => warnSpy.mockReset());

  test('markup instruction', () => {
    const instruction = { name: 'markup', value: 'markdown' };
    const state = useProcessingInstruction(baseState, instruction);
    expect(state.markup).toBe(instruction.value);
  });

  test('engine instruction', () => {
    const state = useProcessingInstruction(baseState, { name: 'engine', value: '>=1.0.0' });
    expect(state).toEqual(baseState);
  });

  test('unimplemented instructions', () => {
    useProcessingInstruction(baseState, { name: 'transition', value: 'something' });
    expect(warnSpy).toHaveBeenCalled();
    useProcessingInstruction(baseState, { name: 'include', value: 'something' });
    expect(warnSpy).toHaveBeenCalled();
  });

  test('unknown instruction', () => {
    const instruction = { name: 'unknown', value: '123' };
    useProcessingInstruction(baseState, instruction);
    expect(warnSpy).toHaveBeenCalled();
  });

  test('from XML object translates to separate attributes', () => {
    const SPECIFIC = 'SPECIFIC' as const;
    const instruction: XmlParserProcessingInstructionNode = {
      content: `markup="${SPECIFIC}"`,
      name: 'slyde',
      type: 'ProcessingInstruction',
    } satisfies XmlParserProcessingInstructionNode;
    const state = useProcessingInstruction(baseState, instruction);
    expect(state.markup).toBe(SPECIFIC);
  });
});
