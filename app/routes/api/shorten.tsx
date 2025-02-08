import { ActionFunction } from "@remix-run/node";
import { ShortenUrlService } from "~/domain/shorten_url/ShortenUrlService";
import { SQLiteUrlMappingRepository } from "~/infrastructure/UrlMapping";
import path from "path";
import { fileURLToPath } from "url";

// __dirnameの代わりにimport.meta.urlを使用
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .envなどから取得するべきだが、今回は一旦固定値
// TODO: .envから取得するように修正
const dbFilePath = path.resolve(__dirname, "../../../db/database.sqlite");

const urlMappingRepository = new SQLiteUrlMappingRepository(dbFilePath);
const shortenUrlService = new ShortenUrlService(urlMappingRepository);

export const action: ActionFunction = async ({ request }) => {

  // リクエストから元URLを取得
  const formData = await request.formData();
  const originalUrl = formData.get("url") as string;

  // TODO: 正しいURLが指定されているかどうか検証
  // -> 正しいURLが指定されていない場合はエラーを返す

  // 短縮URLを生成
  const shortenUrl = await shortenUrlService.generate(originalUrl);

  // 短縮URLを返す
  return Response.json({ url: shortenUrl });

}
