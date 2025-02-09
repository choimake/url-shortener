import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { action as shortenAction } from "~/routes/api/shorten";

export const meta: MetaFunction = () => {
  return [
    { title: "Url Shortener" },
    { name: "description", content: "choimake's url shortener. It's demo." },
  ];
};

// formの送信時に実行されるアクションの指定をしている、という意味のコードとのこと
export { shortenAction as action };

export default function Index() {

  // useActionDataは、アクションの実行結果を取得するためのフック
  // { url?: string; error?: string } は、アクションの返り値の型を指定している
  const actionData = useActionData<{ url?: string; error?: string }>();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-white">Url Shortener</h1>
      <Form method="post" className="bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-4">
          <span className="text-gray-300">URL:</span>
          <input
            type="url"
            name="url"
            required
            className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Shorten URL
        </button>
      </Form>
      {actionData?.url && (
        <div className="mt-4 p-4 bg-indigo-600 text-white rounded-md shadow-lg w-full max-w-md">
          <label className="block mb-2">
            <span className="font-bold">Shorten URL:</span>
            <input
              type="text"
              value={actionData.url}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
            />
          </label>
        </div>
      )}
      {actionData?.error && (
        <div className="mt-4 p-4 bg-red-500 text-white rounded-md shadow-lg w-full max-w-md">
          <span className="font-bold">Error:</span> {actionData.error}
        </div>
      )}
    </div>
  );
}
