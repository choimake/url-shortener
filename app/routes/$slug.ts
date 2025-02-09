import { LoaderFunction, redirect } from "@remix-run/node";
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

export const loader: LoaderFunction = async ({ params }) => {

  // リクエストから元URLを取得
  if (!params.slug) {
    console.debug("slug is not found");
    return new Response("Not Found", { status: 404 });
  }
  console.log(params.slug);
  const originalUrl = await shortenUrlService.fetchOriginalUrl(params.slug);
  if (originalUrl === null) {
    console.debug("originalUrl is not found");
    return new Response("Not Found", { status: 404 });
  }

  // 元URLへリダイレクト
  return redirect(originalUrl, { status: 302 });
};
