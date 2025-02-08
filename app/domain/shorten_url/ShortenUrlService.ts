import { ShortId } from "./ShortId";


/**
 * 短縮URLを生成するService
 */
export class ShortenUrlService {
  private static readonly MAX_RETRIES = 10; // 衝突回避のための最大試行回数

  public static generate(originalUrl: string): URL {
    for (let i = 0; i < ShortenUrlService.MAX_RETRIES; i++) {
      const shortId = ShortId.generate();

      // TODO: 生成した短縮URLの識別子がすでに生成済みの識別子でないか確認

      // TODO: 元URLと短縮URLの対応データを保存

      // 短縮URLを生成して返す
      return new URL (`http://localhost:5173/${shortId.toValue()}`);
    }
    throw new Error("Failed to generate a unique ShortId after multiple attempts.");
  }

}
