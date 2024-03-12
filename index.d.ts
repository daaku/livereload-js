/**
 * Path the handler must be mounted at.
 */
export declare const lrPath = '/livereload'

/**
 * This JS should included on the webpages that need livereload. Including it
 * will automatically setup the necessary functionality. Make sure to setup the
 * corresponding liveReloadHandler at /livereload.
 */
export declare const lrJS: string

/**
 * This handler should be mounted to the /livereload path. Ensure you include
 * the corresponding JS in the HTML response.
 */
export declare const lrHandler: (req: Request) => Response
