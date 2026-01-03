import { type MockInstance, beforeEach, describe, expect, test, vi } from 'vitest';
import { toDataURL, toMime } from '#lib/core/components/utils/fetch';
import { promises as FileSystem } from 'fs';

// --- Mock fs ---
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
    stat: vi.fn(),
  },
}));

// --- Mock fetch ---
global.fetch = vi.fn();

// --- Logger mock (optional) ---
vi.mock('#lib/logger', () => ({
  Logger: {
    critical: console.error, // eslint-disable-line no-console
    debug: console.error, // eslint-disable-line no-console
    error: console.error, // eslint-disable-line no-console
    info: console.error, // eslint-disable-line no-console
    warn: console.error, // eslint-disable-line no-console
  },
}));

describe('function toDataURL', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('converts a local file to a data URL', async () => {
    const fakeContent = Buffer.from('hello world');
    (FileSystem.readFile as unknown as MockInstance).mockResolvedValue(fakeContent);
    (FileSystem.stat as unknown as MockInstance).mockResolvedValue({});

    const dataUrl = await toDataURL('test.png');
    expect(dataUrl).toMatch(/^data:image\/png;base64,/u);
    expect(FileSystem.readFile).toHaveBeenCalledWith(expect.stringContaining('test.png'));
  });

  test('converts a remote URL to a data URL', async () => {
    const fakeResponse = {
      arrayBuffer: vi.fn().mockResolvedValue(Buffer.from('remote content')),
      headers: { get: vi.fn().mockReturnValue('image/jpeg') },
    };
    (fetch as unknown as MockInstance).mockResolvedValue(fakeResponse);

    const url = 'https://example.com/img.jpg';
    const dataUrl = await toDataURL(url);
    expect(dataUrl).toMatch(/^data:image\/jpeg;base64,/u);
    expect(fetch).toHaveBeenCalledWith(url);
  });

  test('throws for non-existent file', async () => {
    (FileSystem.stat as unknown as MockInstance).mockRejectedValue(new Error('not found'));
    await expect(toDataURL('missing.png')).rejects.toThrow(/found neither/u);
  });
});

describe('function toMime', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('normal type', () => {
    expect(() => toMime('png')).not.toThrow();
  });

  test('garbage input throws', () => {
    expect(() => toMime('GAR8AG3')).toThrow();
  });
});
