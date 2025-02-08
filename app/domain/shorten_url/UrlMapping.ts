
export interface UrlMapping {
  shortId: string;
  originalUrl: string;
}

export interface UrlMappingRepository {
  save(shortId: string, originalUrl: string): Promise<void>;
  findByOriginalUrl(originalUrl: string): Promise<UrlMapping | null>;
  findByShortId(shortId: string): Promise<UrlMapping | null>;
}
