import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";

const shouldStartDevServer = process.env.NODE_ENV !== "production";
const isStagingOrPreviewEnvironment = process.env.ENVIRONMENT !== "production";

const viteDevServer = shouldStartDevServer
  ? await import("vite").then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    )
  : undefined;

const remixHandler = createRequestHandler({
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

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`),
);
