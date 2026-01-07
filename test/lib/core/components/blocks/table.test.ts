import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Table } from '#lib/core/components/blocks/table';

describe(`class ${Table.name} implements Component`, () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Table.name)).toBe(Table);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: Component.level.block,
    path: '//',
  } satisfies Component.ConstructorArguments;

  test('Is creatable', () => {
    expect(() => new Table({ ...construct })).not.toThrow();
  });

  const pattern = '<VERY-SPECIFIC-PATTERN>' as const;
  const children = (() => pattern) as () => string;
  const render = {} satisfies Component.RenderArguments;

  test('renders with children', async () => {
    const instance = new Table({ ...construct }) as Component.Interface;
    await expect(Promise.resolve(instance.render({ ...render, children }))).resolves.not.toThrow();
  });

  test('uses children within somewhere', async () => {
    const instance = new Table({ ...construct }) as Component.Interface;
    const result = await (async (): Promise<string> => instance.render({ ...render, children }))();
    expect(result).toContain(pattern);
  });

  test('does not render without children', async () => {
    const instance = new Table({ ...construct }) as Component.Interface;
    await expect(async () => instance.render({ ...render })).rejects.toThrow();
  });
});
