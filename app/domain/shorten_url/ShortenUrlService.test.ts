import { test, expect, vi } from 'vitest';
import { ShortenUrlService } from './ShortenUrlService';

test('ShortenUrlService.generate() should generate a valid shortened URL', () => {

  // ShortIdの生成処理をMock
  vi.mock('./ShortId', () => ({
    ShortId: {
      generate: vi.fn().mockImplementation(() => ({
        toValue: () => 'A1B2C3D4',
      })),
    },
  }));

  const originalUrl = 'http://example.com';
  const shortenedUrl = ShortenUrlService.generate(originalUrl);

  expect(shortenedUrl.toString()).toBe('http://localhost:5173/A1B2C3D4');
});

test('ShortenUrlService.generate() should throw an error after maximum retries', () => {

  // ShortenUrlServiceの短縮URL識別子の重複チェック処理をMock
  const alreadyExistsSpy = vi.spyOn(ShortenUrlService, 'alreadyExists').mockReturnValue(true);

  const originalUrl = 'http://example.com';

  expect(() => {
    ShortenUrlService.generate(originalUrl);
  }).toThrow('Failed to generate a unique ShortId after multiple attempts.');
});
