/**
 * Dev-only: runs the Vercel serverless function locally so `npm run dev` has a
 * working /api/chat. Requires Node 22.6+ (type stripping) — Node 25 works out
 * of the box.
 *
 *   node scripts/dev-api.mjs
 *   DEV_API_TARGET=http://localhost:4199 npm run dev
 */
import { createServer } from "node:http";
import handler from "../api/chat.ts";

const port = Number(process.env.DEV_API_PORT || 4199);

createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try {
    const res_ = await handler(
      new Request(`http://localhost:${port}${req.url}`, {
        method: req.method,
        headers: { "content-type": "application/json" },
        body: chunks.length ? Buffer.concat(chunks).toString("utf8") : undefined,
      }),
    );
    res.writeHead(res_.status, Object.fromEntries(res_.headers));
    res.end(await res_.text());
  } catch (error) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: String(error) }));
  }
}).listen(port, () => console.log(`[dev-api] http://localhost:${port}/api/chat`));