import { LoaderFunction, redirect } from "@remix-run/node";
import { shortenUrlService } from "~/config/server";

export const loader: LoaderFunction = async ({ params }) => {

  // リクエストから元URLを取得
  if (!params.slug) {
    console.debug("slug is not found");
    return new Response("Not Found", { status: 404 });
  }
  const originalUrl = await shortenUrlService.fetchOriginalUrl(params.slug);
  if (originalUrl === null) {
    console.debug("originalUrl is not found");
    return new Response("Not Found", { status: 404 });
  }

  // 元URLへリダイレクト
  return redirect(originalUrl, { status: 302 });
};
