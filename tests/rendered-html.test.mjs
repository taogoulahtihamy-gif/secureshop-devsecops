import assert from "node:assert/strict";
import test from "node:test";

test("renders SecureShop HTML", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);

  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    }
  );

  assert.equal(response.status, 200);

  assert.match(
    response.headers.get("content-type") ?? "",
    /text\/html/i
  );

  const html = await response.text();

  assert.match(html, /SecureShop/i);
  assert.match(html, /Connectez-vous/i);
});