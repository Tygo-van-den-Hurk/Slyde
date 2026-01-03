import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';

describe('author property branch coverage', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('uses process.env.USER if defined', async () => {
    const user = '<user>';
    process.env.USER = user;
    delete process.env.USERNAME;
    const { author } = await import('#lib/core/defaults');
    expect(author).toBe(user);
  });

  test('uses process.env.USERNAME if USER is undefined', async () => {
    const user = '<user>';
    delete process.env.USER;
    process.env.USERNAME = user;
    const { author } = await import('#lib/core/defaults');
    expect(author).toBe(user);
  });

  test('falls back to unknown author if both undefined', async () => {
    delete process.env.USER;
    delete process.env.USERNAME;
    const { author } = await import('#lib/core/defaults');
    expect(typeof author).toBe('string');
  });
});
