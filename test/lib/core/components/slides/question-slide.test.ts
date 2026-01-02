import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { QuestionSlide } from '#lib/core/components/slides/question-slide';

describe('class QuestionSlide implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(QuestionSlide.name)).toBe(QuestionSlide);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 1,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable', () => {
    expect(() => new QuestionSlide({ ...construct })).not.toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders with children', () => {
    expect(() => new QuestionSlide({ ...construct }).render({ ...render, children })).not.toThrow();
  });

  test('renders without children', () => {
    expect(() => new QuestionSlide({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('uses children within somewhere', () => {
    expect(new QuestionSlide({ ...construct }).render({ ...render, children })).toContain(pattern);
  });
});
