/* eslint-disable no-console */
/* eslint-disable import/no-named-as-default-member */
import { createRequestHandler } from "@remix-run/express";
import type { ServerBuild } from "@remix-run/node";
import * as Sentry from "@sentry/remix";
import compression from "compression";
import express from "express";
import { rateLimit } from "express-rate-limit";
import Redis from "ioredis";
import { RedisStore, type RedisReply } from "rate-limit-redis";
import type { ViteDevServer } from "vite";
import { setRedisClient } from "./services/session.server/redis";
import { getPosthogClient } from "./services/analytics/posthogClient.server";

const redisUrl = () =>
  `rediss://default:${process.env.REDIS_PASSWORD?.trim()}@${process.env.REDIS_ENDPOINT ?? "localhost:6380"}`;

export const expressApp = (
  build: ServerBuild,
  viteDevServer: ViteDevServer,
) => {
  const isStagingOrPreviewEnvironment =
    process.env.ENVIRONMENT !== "production";

  const redisClient = new Redis(redisUrl(), {
    tls: { rejectUnauthorized: false },
    retryStrategy: (times) => Math.min(times * 100, 2000),
    enableReadyCheck: true,
    maxRetriesPerRequest: null,
  });

  setRedisClient(redisClient);

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
  app.use(
    "/*/pdf",
    rateLimit({
      windowMs: 2 * 1000,
      max: 2, // Limit each IP to 2 request per 2s
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message:
        '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>Justiz Services - Fehler aufgetreten</title><style>html{font-family:BundesSansWeb,Calibri,Verdana,Arial,Helvetica,sans-serif;font-size:1.125rem;line-height:1.75rem}body{max-width:59rem;margin:6rem auto;padding:0 2rem}h1{font-size:1.875rem;padding-bottom:1.5rem}</style></head><body><h1>Justiz Service ist vorübergehend nicht erreichbar</h1><p>Es sind zu viele Anfragen zum Herunterladen des PDFs innerhalb kurzer Zeit gestellt worden. Bitte versuchen Sie es später noch einmal.</p></body></html>',
      store: new RedisStore({
        sendCommand: (command: string, ...args: string[]) =>
          redisClient.call(command, args) as Promise<RedisReply>,
      }),
    }),
  );

  // handle SSR requests
  const remixHandler = createRequestHandler({ build });

  app.all("*", remixHandler);

  return {
    app,
    cleanup: async () => {
      const shutdownTimoutMs = 1000;
      return Promise.all([
        redisClient.quit().then(() => {
          console.log("✅ reddis client");
        }),
        Sentry.close(shutdownTimoutMs).then(() => {
          console.log("✅ Sentry client");
        }),
        getPosthogClient()
          ?.shutdown(shutdownTimoutMs)
          .then(() => {
            console.log("✅ Posthog client");
          }),
      ]);
    },
  };
};
