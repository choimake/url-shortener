
// 型定義のみを記述したい場合には、interface を使うものという認識
// 今回の以下のケースにおいて、interfaceを使用することに対する妥当性がどれくらいあるかは判断できていない
export interface UrlMapping {
  shortId: string;
  originalUrl: string;
}

export interface UrlMappingRepository {
  save(shortId: string, originalUrl: string): Promise<void>;
  findByOriginalUrl(originalUrl: string): Promise<UrlMapping | null>;
  findByShortId(shortId: string): Promise<UrlMapping | null>;
}
