import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
import { Response, redirect } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as Sentry from "@sentry/remix";
import { config } from "./services/env/web";
import { config as configServer } from "~/services/env/env.server";
import { generateNonce, NonceContext } from "./services/security/nonce";
import { stripTrailingSlashFromURL } from "./util/strings";

const { SENTRY_DSN, ENVIRONMENT } = config();
if (SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
  });
}

const ABORT_DELAY = 5000;

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
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;

          console.error(error);
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
      `default-src 'self'; script-src 'self' 'nonce-${cspNonce}'; style-src 'self' 'unsafe-inline'; connect-src ${
        configServer().TRUSTED_CSP_CONNECT_SOURCES
      };  img-src 'self' localhost:* ${configServer().TRUSTED_IMAGE_SOURCES}`,
    );

    const { pipe, abort } = renderToPipeableStream(
      <NonceContext.Provider value={cspNonce}>
        <RemixServer context={remixContext} url={request.url} />
      </NonceContext.Provider>,
      {
        nonce: cspNonce,
        onShellReady() {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(err: unknown) {
          Sentry.captureException(err);

          // Sentry logging

          reject(err);
        },
        onError(error: unknown) {
          Sentry.captureException(error);
          didError = true;

          // Sentry logging

          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
