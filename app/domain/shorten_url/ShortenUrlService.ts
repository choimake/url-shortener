import { ShortId } from "./ShortId";
import { UrlMappingRepository } from "./UrlMapping";


/**
 * 短縮URLを生成するService
 */
export class ShortenUrlService {

  // NOTE:
  // 10回にした明確な理由は特にない。適当に決めた値である。
  private static readonly MAX_RETRIES = 10; // 衝突回避のための最大試行回数

  private baseUrl: string;
  private urlMappingRepository: UrlMappingRepository;

  public constructor(baseUrl: string, urlMappingRepository: UrlMappingRepository) {
    this.baseUrl = baseUrl;
    this.urlMappingRepository = urlMappingRepository;
  }

  public async generate(originalUrl: string): Promise<URL> {

    // URL短縮識別子が衝突した時の回避のためのループ処理
    for (let i = 0; i < ShortenUrlService.MAX_RETRIES; i++) {

      // 元URLに対する短縮URL識別子がすでに存在するか確認
      const mapping = await this.urlMappingRepository.findByOriginalUrl(originalUrl);

      // すでに存在する場合はその短縮URLを返す（新たに生成する必要がないため）
      if (mapping !== null) {
        return new URL(`${this.baseUrl}/${mapping.shortId}`);
      }

      // まだ短縮URL識別子がない場合は、短縮URLの識別子を新たに生成
      const shortId = ShortId.generate();

      try {
        // 元URLと短縮URLの対応データを保存
        await this.urlMappingRepository.save(shortId.toValue(), originalUrl);
      } catch (error) {
        // 保存に失敗した場合はリトライ
        continue;
      }

      // 短縮URLを生成して返す
      return new URL(`${this.baseUrl}/${shortId.toValue()}`);

    }

    throw new Error("Failed to generate a unique ShortId after multiple attempts.");
  }

  public async fetchOriginalUrl(shortId: string): Promise<string | null> {
    const urlMapping = await this.urlMappingRepository.findByShortId(shortId);
    if (urlMapping === null) {
      return null;
    }
    return urlMapping.originalUrl;
  }

}
