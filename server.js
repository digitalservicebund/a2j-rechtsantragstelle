import { wrapExpressCreateRequestHandler } from "@sentry/remix";
import { createRequestHandler } from "@remix-run/express";
import { rateLimit } from "express-rate-limit";
import compression from "compression";
import express from "express";

const sentryCreateRequestHandler =
  wrapExpressCreateRequestHandler(createRequestHandler);

const shouldStartDevServer = process.env.NODE_ENV !== "production";
const isStagingOrPreviewEnvironment = process.env.ENVIRONMENT !== "production";

const viteDevServer = shouldStartDevServer
  ? await import("vite").then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    )
  : undefined;

const remixHandler = sentryCreateRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
const staticFileServer = express.static("build/client", { maxAge: "1h" });
const mountPathWithoutStorybook = [
  /^\/build\/client\/storybook($|\/)/,
  "/build/client",
];

isStagingOrPreviewEnvironment
  ? app.use(staticFileServer)
  : app.use(mountPathWithoutStorybook, staticFileServer);

app.set("trust proxy", 2);
app.get("/ip", (request, response) => response.send(request.ip));

// Limit calls to routes ending in /pdf or /pdf/, as they are expensive
app.use(
  /.*\/pdf(\/|$)/,
  rateLimit({
    windowMs: 2 * 1000,
    max: 4, // Limit each IP to 4 request per 2s
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message:
      '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>Justiz Services - Fehler aufgetreten</title><style>html{font-family:BundesSansWeb,Calibri,Verdana,Arial,Helvetica,sans-serif;font-size:1.125rem;line-height:1.75rem}body{max-width:59rem;margin:6rem auto;padding:0 2rem}h1{font-size:1.875rem;padding-bottom:1.5rem}</style></head><body><h1>Justiz Service ist vorübergehend nicht erreichbar</h1><p>Es sind zu viele Anfragen zum Herunterladen des PDFs innerhalb kurzer Zeit gestellt worden. Bitte versuchen Sie es später noch einmal.</p></body></html>',
  }),
);

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`),
);
