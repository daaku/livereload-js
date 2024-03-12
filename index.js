// this setup makes it compatible with --hot reloading used in Bun.
const token = '__liveReloadToken__'
globalThis[token] = Date.now()

// this setup is to allow instant triggers when we are reloaded.
const active = '__liveReloadActive__'
globalThis[active]?.forEach(h => h())
globalThis[active] ??= new Set()

/**
 * Path the handler must be mounted at.
 */
export const lrPath = '/livereload'

/**
 * This JS should included on the webpages that need livereload. Including it
 * will automatically setup the necessary functionality. Make sure to setup the
 * corresponding liveReloadHandler at /livereload.
 */
export const lrJS = `
(() => {
  let token;
  let att = 0;
  let pending;
  const schedule = () => {
    clearTimeout(pending);
    pending = setTimeout(monitor, Math.min(50 * Math.pow(1.05, att++), 5000));
  };
  const monitor = () => {
    const es = new EventSource('${lrPath}');
    es.addEventListener('token', ev => {
      if (!token) {
        token = event.data;
      } else if (token !== event.data) {
        es.close();
        location.reload();
      }
    })
    es.addEventListener('error', ev => {
      es.close();
      schedule();
    })
  };
  monitor();
})();
`

/**
 * This handler should be mounted to the /livereload path. Ensure you include
 * the corresponding JS in the HTML response.
 */
export const lrHandler = req => {
  return new Response(
    new ReadableStream({
      start(controller) {
        const handler = () =>
          controller.enqueue(`event: token\ndata: ${globalThis[token]}\n\n`)
        globalThis[active].add(handler)
        const interval = setInterval(handler, 1000)
        req.signal.onabort = () => {
          globalThis[active].delete(handler)
          clearInterval(interval)
          controller.close()
        }
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    },
  )
}
