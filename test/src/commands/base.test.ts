import { describe, expect, test } from 'vitest';
import { cli } from '#src/commands/base';

describe('program', () => {
  // Tests relating `program`:

  test('is defined', () => {
    expect(cli).toBeDefined();
  });
});
