import { lrPath, lrJS, lrHandler } from './index'

Bun.serve({
  fetch(req: Request) {
    if (new URL(req.url).pathname === lrPath) {
      return lrHandler(req)
    }
    return new Response(
      `<!doctype html>
      <strong>Hello, world</strong>
      <script>${lrJS}</script>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } },
    )
  },
})
