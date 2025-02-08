import { ActionFunction } from "@remix-run/node";
import { ShortenUrlService } from "~/domain/shorten_url/ShortenUrlService";

export const action: ActionFunction = async ({ request }) => {

  // リクエストから元URLを取得
  const formData = await request.formData();
  const originalUrl = formData.get("url") as string;

  // TODO: 正しいURLが指定されているかどうか検証
  // -> 正しいURLが指定されていない場合はエラーを返す

  // 短縮URLを生成
  const shortenUrl = ShortenUrlService.generate(originalUrl);

  // 短縮URLを返す
  return Response.json({ url: shortenUrl });

}
