/* eslint-disable max-classes-per-file */

import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';

describe('implements Component', () => {
  test(`garbage is not found`, () => {
    // eslint-disable-next-line no-undefined
    expect(Component.retrieve('GAR8AG3')).toBe(undefined);
  });

  test(`Component.Keys() includes the name of a class we register`, () => {
    @Component.register
    class ABCDEFG extends Component {
      // eslint-disable-next-line @typescript-eslint/class-methods-use-this
      public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
        throw new Error('Method not implemented.');
      }

      // eslint-disable-next-line @typescript-eslint/class-methods-use-this
      public render(): string {
        throw new Error('Method not implemented.');
      }
    }

    expect(Component.keys()).includes(ABCDEFG.name);
    expect(Component.retrieve(ABCDEFG.name)).toBe(ABCDEFG);
  });

  test(`Component.Keys() includes the name of a class we register`, () => {
    @Component.register
    class ABC123 extends Component {
      // eslint-disable-next-line @typescript-eslint/class-methods-use-this
      public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
        return [1];
      }

      // eslint-disable-next-line @typescript-eslint/class-methods-use-this
      public render(): string {
        throw new Error('Method not implemented.');
      }
    }

    expect(
      () =>
        new ABC123({
          attributes: {},
          focusMode: 'default',
          id: '',
          level: 0,
          path: '//',
        })
    ).toThrow();
  });
});
