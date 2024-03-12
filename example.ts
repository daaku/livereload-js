import { liveReloadHandler, liveReloadJS } from './index'

Bun.serve({
  fetch(req: Request) {
    if (new URL(req.url).pathname === '/livereload') {
      return liveReloadHandler(req)
    }
    return new Response(
      `<!doctype html>
      <strong>Hello, world</strong>
      <script>${liveReloadJS}</script>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } },
    )
  },
})
