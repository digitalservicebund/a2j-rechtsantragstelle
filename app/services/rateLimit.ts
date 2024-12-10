import { rateLimit } from "express-rate-limit";
import type Redis from "ioredis";
import { RedisStore, type RedisReply } from "rate-limit-redis";

export function createRateLimitRequestHandler(redisClient: Redis) {
  return rateLimit({
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
  });
}
