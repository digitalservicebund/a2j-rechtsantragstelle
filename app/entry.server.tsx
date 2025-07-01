import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext, HandleErrorFunction } from "react-router";
import { redirect, ServerRouter } from "react-router";
import { preloadAll } from "vite-preload";
import { config } from "./services/env/env.server";
import { config as configPublic } from "./services/env/public";
import { logError } from "./services/logging";
import { cspHeader } from "./services/security/cspHeader.server";
import { NonceContext } from "./services/security/nonce";
import { generateNonce } from "./services/security/nonce.server";
import { originFromUrlString } from "./util/originFromUrlString";
import { stripTrailingSlashFromURL } from "./util/strings";
export { expressApp } from "./expressApp"; //re-exported to be called from server.js

const ABORT_DELAY = 5000;
const CONNECT_SOURCES = [originFromUrlString(configPublic().SENTRY_DSN)].filter(
  (origin) => origin !== undefined,
);

export const handleError: HandleErrorFunction = (error, { request }) => {
  // React Router may abort some interrupted requests, don't log those
  if (!request.signal.aborted) {
    logError({ error });
  }
};

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  // Preload all async chunks on the server otherwise the first render will trigger the suspense fallback because the lazy import has not been resolved
  await preloadAll();

  // const collector = createChunkCollector({
  //   manifest: "./dist/client/.vite/manifest.json",
  //   entry: "index.html",
  // });

  // const template =
  //   process.env.NODE_ENV === "production"
  //     ? fs.readFileSync("./dist/client/index.html", { encoding: "utf-8" })
  //     : undefined;

  // Write a HTTP 103 Early Hint way before React even started rendering with the entry chunks which we know we will be needed by the client.
  // Chrome will only pick it up when running with HTTP/2 so try Firefox if you want to test it.
  // res.writeEarlyHints({
  //   link: collector.getLinkHeaders(),
  // });

  const urlIfChanged = stripTrailingSlashFromURL(request.url);
  if (urlIfChanged !== undefined) return redirect(urlIfChanged, 301);

  const isBotRequest = isbot(request.headers.get("user-agent"));

  // const [head, tail] = template?.split("<!-- app-root -->") ?? [];
  let didError = false;
  let cspNonce: string | undefined;
  if (!isBotRequest && responseHeaders.set) {
    cspNonce = generateNonce();
    responseHeaders.set(
      "Content-Security-Policy",
      cspHeader({
        nonce: cspNonce,
        environment: configPublic().ENVIRONMENT,
        additionalConnectSrc: CONNECT_SOURCES,
        reportUri: config().CSP_REPORT_URI,
      }),
    );
  }
  return new Promise((resolve, reject) => {
    const ServerRouterElement = (
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={cspNonce}
      />
    );

    const Wrapper = isBotRequest ? (
      <>{ServerRouterElement}</>
    ) : (
      <NonceContext.Provider value={cspNonce}>
        {ServerRouterElement}
      </NonceContext.Provider>
    );

    const { pipe, abort } = renderToPipeableStream(Wrapper, {
      nonce: cspNonce,
      ...(isBotRequest
        ? {
            onAllReady() {
              const body = new PassThrough();
              responseHeaders.set("Content-Type", "text/html");

              resolve(
                new Response(createReadableStreamFromReadable(body), {
                  headers: responseHeaders,
                  status: didError ? 500 : responseStatusCode,
                }),
              );

              pipe(body);
            },
          }
        : {}),
      ...(!isBotRequest
        ? {
            onShellReady() {
              const body = new PassThrough();
              responseHeaders.set("Content-Type", "text/html");

              resolve(
                new Response(createReadableStreamFromReadable(body), {
                  headers: responseHeaders,
                  status: didError ? 500 : responseStatusCode,
                }),
              );

              pipe(body);
            },
          }
        : {}),
      onShellError(error: unknown) {
        if (!isBotRequest) {
          logError({ error });
        }
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error ?? "Unknown error");
      },
      /**
       * Should the order here be the other way around?
       */
      onError(error: unknown) {
        didError = true;

        logError({ error });
      },
    });

    setTimeout(abort, ABORT_DELAY);
  });
}
