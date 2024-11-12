import type { AppLoadContext } from "@remix-run/node";
import RedisClient from "ioredis";
import { z } from "zod";
import { setRedisClient } from "./session.server/redis";

const remixContextSchema = z.object({
  debugId: z.string().optional(),
  redisClient: z.instanceof(RedisClient),
});

export function handleRemixContext(context: AppLoadContext) {
  const { redisClient, ...rest } = remixContextSchema.parse(context);
  setRedisClient(redisClient);
  return rest;
}
