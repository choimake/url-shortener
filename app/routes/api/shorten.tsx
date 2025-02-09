import { ActionFunction } from "@remix-run/node";
import { ShortenUrlService } from "~/domain/shorten_url/ShortenUrlService";
import { SQLiteUrlMappingRepository } from "~/infrastructure/UrlMapping";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// 未設定の場合はエラーをスロー
if (!process.env.BASE_URL) {
  throw new Error("❌ BASE_URL is not defined in .env. Please set it before running the application.");
}
if (!process.env.DATABASE_FILE_PATH) {
  throw new Error("❌ DATABASE_FILE_PATH is not defined in .env. Please set it before running the application.");
}

const baseUrl = process.env.BASE_URL;
const dbFilePath = path.resolve(process.env.DATABASE_FILE_PATH);

const urlMappingRepository = new SQLiteUrlMappingRepository(dbFilePath);
const shortenUrlService = new ShortenUrlService(baseUrl, urlMappingRepository);

export const action: ActionFunction = async ({ request }) => {

  // リクエストから元URLを取得
  const formData = await request.formData();
  const originalUrl = formData.get("url") as string;

  // 正しいURLが指定されているかどうか検証
  // -> 正しいURLが指定されていない場合はエラーを返す
  if (!originalUrl || !isValidUrl(originalUrl)) {
    return new Response(JSON.stringify({ error: "Invalid URL format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 短縮URLを生成
  const shortenUrl = await shortenUrlService.generate(originalUrl);

  // 短縮URLを返す
  return new Response(JSON.stringify({ url: shortenUrl.toString() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

}

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (_) {
    return false;
  }
}
