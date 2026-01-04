import { describe, expect, test } from 'vitest';
import { LatexRenderer } from '#lib/core/markup/languages/latex';
import { MarkupRenderer } from '#lib/core/markup/class';

describe('class LatexRenderer extends MarkupRender', () => {
  test(`is registered in the markup language registry`, () => {
    const expected = LatexRenderer;
    const result = MarkupRenderer.retrieve(LatexRenderer.name);
    expect(expected).toBe(result);
  });

  test('renders latex into something else', () => {
    const input = `{x\\over2}`;
    const result = new LatexRenderer().render(`$${input}$`);
    expect(result).not.toBe(input);
  });

  test('throws error when invalid latex is detected.', () => {
    const input = `{x\\over2`;
    const renderer = new LatexRenderer();
    const fn = (): unknown => renderer.render(`$${input}$`);
    expect(fn).toThrow();
  });
});
