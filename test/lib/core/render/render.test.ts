import { Globals, type RenderState } from '#lib/core/render/types';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { handleComment, handleDocType, render, renderText } from '#lib/core/render/render';
import parseXml, {
  type XmlParserCommentNode,
  type XmlParserDocumentTypeNode,
  type XmlParserTextNode,
} from 'xml-parser-xo';
import { Component } from '#lib/core/components';
import { Logger } from '#lib/logger';
import { SlydeMarkupRenderer } from '#lib/core/markup/languages/slyde';

const warnSpy = vi.spyOn(Logger, 'warn').mockImplementation(() => {
  // We do nothing with any of the arguments...
});

describe('function handleDocType', () => {
  afterEach(() => warnSpy.mockReset());

  test('DocType with slyde', () => {
    const input = {
      content: 'nope',
      type: 'DocumentType',
    } satisfies XmlParserDocumentTypeNode;
    handleDocType(input);
    expect(warnSpy).toHaveBeenCalled();
  });

  test('DocType with slyde', () => {
    const input = {
      content: 'slyde',
      type: 'DocumentType',
    } satisfies XmlParserDocumentTypeNode;
    handleDocType(input);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('function handleComment', () => {
  test('adds comment to notes', () => {
    let state: RenderState = {
      globals: Globals.instance,
      id: 45 as number,
      level: Component.level.presentation,
      markup: SlydeMarkupRenderer.name,
      notes: [] as string[],
      path: '//' as const,
    } satisfies RenderState;
    const content = 'This is a comment' as const;
    const comment = { content, type: 'Comment' } satisfies XmlParserCommentNode;
    state = handleComment(state, comment);
    expect(state.notes).toContain(content);
  });
});

describe('function renderText', () => {
  test('renders text using a MarkupRenderer', async () => {
    const state: RenderState = {
      globals: Globals.instance,
      id: 45 as number,
      level: Component.level.presentation,
      markup: SlydeMarkupRenderer.name,
      notes: [] as string[],
      path: '//' as const,
    } satisfies RenderState;
    const content = 'This is a piece of **MARKED UP** text' as const;
    const comment = { content, type: 'Text' } satisfies XmlParserTextNode;
    const result = await renderText(state, comment);
    expect(result).not.toBe(content);
  });
});

const SPECIFIC = 'SPECIFIC' as const;

// eslint-disable-next-line no-inline-comments
const document = /*XML*/ `
<!DOCTYPE slyde>
<?slyde markup="default" ?>
<presentation>
  <slide title="Why you should use Slyde">
    <!-- These are my slide notes in case I forget what to say -->
    <point>It is super **fast** and __easy__ to make slides</point>
    <point>The animations are ^^gorgeous^^!</point>
    <point>Recipient //only// needs a browser to open it</point>
    <point>You can even use latex: $$\\forall_i[ i \\in \\mathbb{N} : i + 1 \\gt i ]$$</point>
    <point><![CDATA[${SPECIFIC}]]></point>
  </slide>
</presentation>` as const;

describe('function render', () => {
  test('renders text using a MarkupRenderer', async () => {
    const parsed = parseXml(document, { strictMode: true });
    const result = await render(parsed);
    expect(result).to.include(SPECIFIC);
  });
});
