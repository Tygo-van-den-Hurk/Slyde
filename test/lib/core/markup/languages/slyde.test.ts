import { describe, expect, test } from 'vitest';
import { LatexRenderer } from '#lib/core/markup/languages/latex';
import { MarkupRenderer } from '#lib/core/markup/class';
import { SlydeMarkupRenderer } from '#lib/core/markup/languages/slyde';

describe('class SlydeMarkup extends MarkupRender', () => {
  test(`is registered in the markup language registry`, () => {
    const expected = SlydeMarkupRenderer;
    const result = MarkupRenderer.retrieve(SlydeMarkupRenderer.name);
    expect(expected).toBe(result);
  });

  test('rendering latex using the latex renderer', () => {
    const input = `{x\\over2}`;
    const result = new SlydeMarkupRenderer().render(`$$${input}$$`);
    expect(result).not.toBe(input);
    const normalized = (str: string): string => str.replace(/MJX-\d+/gu, 'MJX-ID');
    const expected = new LatexRenderer().render(input);
    expect(normalized(result)).toBe(normalized(expected));
  });

  test('rendering invalid latex throws', () => {
    const input = `{x\\over2`;
    const renderer = new SlydeMarkupRenderer();
    const fn = (): string => renderer.render(`$$${input}$$`);
    expect(fn).toThrow();
  });

  test('rendering invalid latex throws', () => {
    const input = `{x\\over2`;
    const renderer = new SlydeMarkupRenderer();
    const fn = (): string => renderer.render(`$$${input}$$`);
    expect(fn).toThrow();
  });

  test('rendering link', () => {
    const input = `[this](http://example.com)`;
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(`<a href="http://example.com">this</a>`);
  });

  test('rendering italic and urls', () => {
    const input = `this is an //HTTP// URL: http://example.com.`;
    const expected = `this is an <em>HTTP</em> URL: <a href="http://example.com">http://example.com</a>.`;
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(expected);
  });

  test('rendering tags inside of HTML', () => {
    const input = `<div> **strong** </div>`;
    const expected = `<div> <strong>strong</strong> </div>`;
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(expected);
  });

  test('images are not rendered out', () => {
    const input = `![this](http://example.com)`;
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('horizontal rulers are not rendered out', () => {
    const input = `this is a example:\n\n---\n\nwhich should not be rendered out.`;
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('lists are not rendered out', () => {
    const input1 = `- this is a list item\n- which should not be rendered out.`;
    const result1 = new SlydeMarkupRenderer().render(input1);
    expect(result1).toBe(input1);
    const input2 = `- this is a **list** item\n- which should not be rendered out.\n- The the internal markdown should.`;
    const result2 = new SlydeMarkupRenderer().render(input2);
    expect(result2).not.toBe(input2);
  });

  test('codeblocks are not rendered out', () => {
    const input = '```\nthis is a codeblock\nthat should not be rendered.\n```';
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('headings are not rendered out', () => {
    const input = '# heading\n';
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('code spans are not rendered out', () => {
    const input = 'this is a code span that should `not` be rendered';
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('blockquotes are not rendered out', () => {
    const input = `> this is a blockquote,\n> that should not be rendered.`;
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('filter out table', () => {
    const input = `| Header |\n|--------|\n| entry  |`;
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  const markers = ['*', '/', '^', '_', '`', '~'] as const;

  const tags: Record<(typeof markers)[number], { open: string; close: string }> = {
    '*': { close: '</strong>', open: '<strong>' },
    '/': { close: '</em>', open: '<em>' },
    '^': { close: '</sup>', open: '<sup>' },
    _: { close: '</u>', open: '<u>' }, // eslint-disable-line id-length
    '`': { close: '</code>', open: '<code>' },
    '~': { close: '</s>', open: '<s>' },
  };

  for (const marker of markers) {
    /// Limit test cases when debugging to not get overwhelmed:
    /// if (marker !== markers[0]) continue;

    const nextMarker = markers[(markers.indexOf(marker) + 1) % markers.length];
    const prevMarker = markers[(markers.indexOf(marker) + markers.length - 3) % markers.length];

    test(`rendering an empty string to see if it stays a literal`, () => {
      const input = '';
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test('rendering text with no markers', () => {
      const input = 'just plain text here';
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test(`rendering a marked word`, () => {
      const input = `${marker}${marker}word${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`${tags[marker].open}word${tags[marker].close}`);
    });

    test(`rendering a marked word inside of a sentence"`, () => {
      const input = `something ${marker}${marker}word${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`something ${tags[marker].open}word${tags[marker].close}`);
    });

    test(`rendering with a marker nested inside of a word`, () => {
      const input = `something word${marker}${marker}word${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`something word${tags[marker].open}word${tags[marker].close}`);
    });

    test(`rendering an escaped marker reverts to a literal"`, () => {
      const input1 = `Lorem \\${marker}${marker}ipsum dolor${marker}${marker} sit`;
      const expected1 = `Lorem ${marker}${marker}ipsum dolor${marker}${marker} sit`;
      const result1 = new SlydeMarkupRenderer().render(input1);
      expect(result1).toBe(expected1);
      const input2 = `Lorem ${marker}${marker}ipsum\\${marker}${marker} dolor${marker}${marker} sit`;
      const expected2 = `Lorem ${tags[marker].open}ipsum${marker}${marker} dolor${tags[marker].close} sit`;
      const result2 = new SlydeMarkupRenderer().render(input2);
      expect(result2).toBe(expected2);
    });

    test('rendering unclosed marker reverts to literal', () => {
      const input = `${marker}${marker}unclosed bold text`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test('rendering multiple unclosed markers revert to literals', () => {
      const input = `${marker}${marker}bold ${nextMarker}${nextMarker}italic`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test('rendering same marker cannot nest within itself', () => {
      const input = `${marker}${marker}outer ${marker}${marker}inner${marker}${marker} outer${marker}${marker}`;
      const expected = `${tags[marker].open}outer ${tags[marker].close}inner${tags[marker].open} outer${tags[marker].close}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(expected);
    });

    test('rendering same marker on different lines', () => {
      const input = `${marker}${marker}line 1
      line 2${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`${tags[marker].open}line 1
      line 2${tags[marker].close}`);
    });

    test('rendering adjacent markers', () => {
      const input = `${marker}${marker}bold${marker}${marker}${marker}${marker}more bold${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `${tags[marker].open}bold${tags[marker].close}${tags[marker].open}more bold${tags[marker].close}`
      );
    });

    test('rendering escaped backslash before marker', () => {
      const input = `\\\\${marker}${marker}word${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`\\${tags[marker].open}word${tags[marker].close}`);
    });

    test('rendering marker at end of string (unclosed)', () => {
      const input = `text ${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test('rendering marker followed immediately by escaped marker', () => {
      const input = `${marker}${marker}\\${marker}${marker}text${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`${tags[marker].open}${marker}${marker}text${tags[marker].close}`);
    });

    test("rendering marker who's first closing marker is an escaped marker", () => {
      const input = `${marker}${marker}text\\${marker}${marker}${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`${tags[marker].open}text${marker}${marker}${tags[marker].close}`);
    });

    // These markers have special properties.
    if (['``'].includes(`${marker}${marker}`)) {
      test('rendering markers in "code blocks" are literal', () => {
        const input = `${marker}${marker}lorem ${nextMarker}${nextMarker}ipsum${nextMarker}${nextMarker} ${prevMarker}${prevMarker}dolor${prevMarker}${prevMarker}${marker}${marker}`;
        const expected = `${tags[marker].open}lorem ${nextMarker}${nextMarker}ipsum${nextMarker}${nextMarker} ${prevMarker}${prevMarker}dolor${prevMarker}${prevMarker}${tags[marker].close}`;
        const result = new SlydeMarkupRenderer().render(input);
        expect(result).toBe(expected);
      });

      continue;
    }

    test(`rendering "something ${marker}${marker}word ${nextMarker}${nextMarker}word${marker}${marker}${nextMarker}${nextMarker}"`, () => {
      const input = `something ${marker}${marker}word ${nextMarker}${nextMarker}word${marker}${marker}${nextMarker}${nextMarker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `something ${tags[marker].open}word ${nextMarker}${nextMarker}word${tags[marker].close}${nextMarker}${nextMarker}`
      );
    });

    test(`rendering "something ${marker}${marker}word ${nextMarker}${nextMarker}word${nextMarker}${nextMarker}${marker}${marker}"`, () => {
      const input = `something ${marker}${marker}word ${nextMarker}${nextMarker}word${nextMarker}${nextMarker}${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `something ${tags[marker].open}word ${tags[nextMarker].open}word${tags[nextMarker].close}${tags[marker].close}`
      );
    });

    // These markers have special properties.
    if (['``'].includes(`${nextMarker}${nextMarker}`)) continue;

    test('rendering multiple properly nested markers', () => {
      const input = `${marker}${marker}word ${nextMarker}${nextMarker}word ${prevMarker}${prevMarker}word${prevMarker}${prevMarker}${nextMarker}${nextMarker}${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `${tags[marker].open}word ${tags[nextMarker].open}word ${tags[prevMarker].open}word${tags[prevMarker].close}${tags[nextMarker].close}${tags[marker].close}`
      );
    });
  }
});
