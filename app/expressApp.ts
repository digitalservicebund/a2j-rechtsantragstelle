/* eslint-disable no-console */
/* eslint-disable import/no-named-as-default-member */
import { createRequestHandler } from "@remix-run/express";
import type { ServerBuild } from "@remix-run/node";
import * as Sentry from "@sentry/remix";
import compression from "compression";
import express from "express";
import type { ViteDevServer } from "vite";
import { getPosthogClient } from "./services/analytics/posthogClient.server";
import { createRateLimitRequestHandler } from "./services/rateLimit";
import { createRedisClient, quitRedis } from "./services/redis/redisClient";

const isStagingOrPreviewEnvironment = process.env.ENVIRONMENT !== "production";

export const expressApp = (
  build: ServerBuild,
  viteDevServer: ViteDevServer,
) => {
  const redisClient = createRedisClient();

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

  if (isStagingOrPreviewEnvironment) {
    app.use(staticFileServer);
  } else {
    app.use(mountPathWithoutStorybook, staticFileServer);
  }

  // For the rate limiting to work, we have to set how many load balancers aka proxy hubs
  // we have in front of our express, which is 2 - experimentally found out.
  app.set("trust proxy", 2);

  // Limit calls to routes ending in /pdf or /pdf/, as they are expensive
  app.use("/*/pdf", createRateLimitRequestHandler(redisClient));

  // handle SSR requests
  const remixHandler = createRequestHandler({ build });

  app.all("*", remixHandler);

  return {
    app,
    cleanup: async () => {
      const shutdownTimeoutMs = 1000;
      return Promise.all([
        quitRedis(redisClient, shutdownTimeoutMs).then(() => {
          console.log("✅ Redis client shut down");
        }),
        Sentry.close(shutdownTimeoutMs).then(() => {
          console.log("✅ Sentry client shut down");
        }),
        getPosthogClient()
          ?.shutdown(shutdownTimeoutMs)
          .then(() => {
            console.log("✅ Posthog client shut down");
          }),
      ]);
    },
  };
};
