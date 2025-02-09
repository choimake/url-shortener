import path from "path";
import dotenv from "dotenv";
import { ShortenUrlService } from "~/domain/shorten_url/ShortenUrlService";
import { SQLiteUrlMappingRepository } from "~/infrastructure/UrlMapping";

// 環境変数をロード
dotenv.config();

// 必須環境変数のチェック
if (!process.env.BASE_URL) {
  throw new Error("❌ BASE_URL is not defined in .env. Please set it before running the application.");
}
if (!process.env.DATABASE_FILE_PATH) {
  throw new Error("❌ DATABASE_FILE_PATH is not defined in .env. Please set it before running the application.");
}

// 環境変数を取得
const baseUrl = process.env.BASE_URL;
const dbFilePath = path.resolve(process.env.DATABASE_FILE_PATH);

// Repository & Service を初期化
const urlMappingRepository = new SQLiteUrlMappingRepository(dbFilePath);
const shortenUrlService = new ShortenUrlService(baseUrl, urlMappingRepository);

export { shortenUrlService };
