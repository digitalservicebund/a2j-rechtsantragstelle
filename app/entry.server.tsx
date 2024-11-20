import { PassThrough } from "stream";
import type {
  ActionFunctionArgs,
  EntryContext,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { createReadableStreamFromReadable, redirect } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { config } from "./services/env/env.server";
import { config as webConfig } from "./services/env/web";
import { logError } from "./services/logging";
import { cspHeader } from "./services/security/cspHeader.server";
import { NonceContext } from "./services/security/nonce";
import { generateNonce } from "./services/security/nonce.server";
import { originFromUrlString } from "./util/originFromUrlString";
import { stripTrailingSlashFromURL } from "./util/strings";
export { expressApp } from "./expressApp"; //re-exported to be called from server.js

const ABORT_DELAY = 5000;
const CONNECT_SOURCES = [originFromUrlString(webConfig().SENTRY_DSN)].filter(
  (origin) => origin !== undefined,
);

export function handleError(
  error: unknown,
  { request }: LoaderFunctionArgs | ActionFunctionArgs,
): void {
  logError({ error, request });
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const urlIfChanged = stripTrailingSlashFromURL(request.url);
  if (urlIfChanged !== undefined) return redirect(urlIfChanged, 301);

  return isbot(request.headers.get("user-agent"))
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
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
        onShellError(error: unknown) {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(error ?? "Unknown error");
        },
        onError(error: unknown) {
          didError = true;

          logError({ error });
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    const cspNonce = generateNonce();
    responseHeaders.set(
      "Content-Security-Policy",
      cspHeader({
        nonce: cspNonce,
        environment: config().ENVIRONMENT,
        additionalConnectSrc: CONNECT_SOURCES,
        reportUri: config().CSP_REPORT_URI,
      }),
    );

    const { pipe, abort } = renderToPipeableStream(
      <NonceContext.Provider value={cspNonce}>
        <RemixServer
          context={remixContext}
          url={request.url}
          nonce={cspNonce}
        />
      </NonceContext.Provider>,
      {
        nonce: cspNonce,
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
        onShellError(error: unknown) {
          logError({ error });

          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(error ?? "Unknown error");
        },
        onError(error: unknown) {
          logError({ error });

          didError = true;
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
