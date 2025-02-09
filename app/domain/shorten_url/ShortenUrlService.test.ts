import { test, expect, vi } from 'vitest';
import { ShortenUrlService } from './ShortenUrlService';
import { UrlMappingRepository } from './UrlMapping';

// 短縮URL生成の正常系
test('ShortenUrlService.generate() should generate a valid shortened URL', async () => {
  // Mock ShortId generation
  vi.mock('./ShortId', () => ({
    ShortId: {
      generate: vi.fn().mockImplementation(() => ({
        toValue: () => 'A1B2C3D4',
      })),
    },
  }));

  // Mock UrlMappingRepository
  const mockUrlMappingRepository: UrlMappingRepository = {
    save: vi.fn(),
    findByOriginalUrl: vi.fn().mockResolvedValue(null),
    findByShortId: vi.fn().mockResolvedValue(null), // 本テストでは未使用だが、未定義だと型が合わずエラーになるので定義
  };

  const baseUrl = 'http://example.base.com';
  const shortenUrlService = new ShortenUrlService(baseUrl, mockUrlMappingRepository);
  const originalUrl = 'http://example.original.com';
  const shortenedUrl = await shortenUrlService.generate(originalUrl);

  expect(shortenedUrl.toString()).toBe('http://example.base.com/A1B2C3D4');
  expect(mockUrlMappingRepository.save).toHaveBeenCalledWith('A1B2C3D4', originalUrl);
});

// 短縮URL生成の異常系
// - 生成した短縮URLの識別子がすでに存在し、生成のリトライ回数が上限を超えた場合
test('ShortenUrlService.generate() should throw an error after maximum retries', async () => {
  // Mock ShortId generation
  vi.mock('./ShortId', () => ({
    ShortId: {
      generate: vi.fn().mockImplementation(() => ({
        toValue: () => 'A1B2C3D4',
      })),
    },
  }));

  const baseUrl = 'http://example.base.com';
  const originalUrl = 'http://example.com';

  // Mock UrlMappingRepository
  const mockUrlMappingRepository: UrlMappingRepository = {
    save: vi.fn().mockImplementation(() => {
      throw new Error('Failed to save URL mapping: ' + 'UNIQUE constraint failed: url_mappings.shortId');
    }),
    findByOriginalUrl: vi.fn().mockResolvedValue(null),
    findByShortId: vi.fn().mockResolvedValue(null),  // 本テストでは未使用だが、未定義だと型が合わずエラーになるので定義
  };

  const shortenUrlService = new ShortenUrlService(baseUrl, mockUrlMappingRepository);

  await expect(shortenUrlService.generate(originalUrl)).rejects.toThrow('Failed to generate a unique ShortId after multiple attempts.');
});
