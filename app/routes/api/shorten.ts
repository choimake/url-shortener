import { ActionFunction } from "@remix-run/node";
import { shortenUrlService } from "~/config/server";

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
