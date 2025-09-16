/* oxlint-disable no-console */
import { createRequestHandler } from "@react-router/express";
import * as Sentry from "@sentry/react-router";
import compression from "compression";
import express, { type RequestHandler } from "express";
import type { ServerBuild } from "react-router";
import type { ViteDevServer } from "vite";
import { shutdownPosthog } from "./services/analytics/posthogClient.server";
import { config } from "./services/env/public";
import { createPinoHttpLogger } from "./services/logging/createPinoHttpLogger";
import { createRateLimitRequestHandler } from "./services/rateLimit";
import { getRedisInstance, quitRedis } from "./services/redis/redisClient";

// expressApp() itself is not hot reloaded
export const expressApp = (
  build: ServerBuild,
  viteDevServer: ViteDevServer,
) => {
  const redisClient = getRedisInstance();
  const reactRouterHandler = createRequestHandler({ build }) as RequestHandler; // express 5 doesn't handle returned promises

  const app = express();

  app.use(compression());

  // Only enable pino logger in non development environment
  if (config().ENVIRONMENT !== "development") {
    const pinoHttpLogger = createPinoHttpLogger();
    app.use(pinoHttpLogger);
  }

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

  // For the rate limiting to work, we have to set how many load balancers aka proxy hubs
  // we have in front of our express, which is 2 - experimentally found out.
  app.set("trust proxy", 2);

  // Limit calls to routes ending in /pdf or /pdf/, as they are expensive
  // Express 5 must have the wildcard * with name. Check https://expressjs.com/en/guide/migrating-5.html#path-syntax
  app.use("/*splat/pdf", createRateLimitRequestHandler(redisClient));

  if (config().ENVIRONMENT === "production") {
    // On production, we let the app handle all calls to /storybook to serve normal 404s
    app.use("/storybook", reactRouterHandler);
  }
  // Everything else (like favicon.ico) is cached for an hour
  // You may want to be more aggressive with this caching.
  app.use(express.static("build/client", { maxAge: "1y" }));
  // Express 5 must have the wildcard * with name. Check https://expressjs.com/en/guide/migrating-5.html#path-syntax
  app.all("*splat", reactRouterHandler);

  return {
    app,
    cleanup: async () => {
      const shutdownTimeoutMs = 1000;
      return Promise.all([
        quitRedis(redisClient, shutdownTimeoutMs).then((cmd) => {
          console.log(`✅ Redis client shut down using ${cmd}`);
        }),
        Sentry.close(shutdownTimeoutMs).then(() => {
          console.log("✅ Sentry client shut down");
        }),
        shutdownPosthog(shutdownTimeoutMs),
      ]);
    },
  };
};
