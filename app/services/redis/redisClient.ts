import Redis from "ioredis";
import invariant from "tiny-invariant";
import { config } from "../env/env.server";
import { logError, logWarning } from "../logging";

let _redisClient: Redis | undefined;

const redisUrl = `rediss://default:${config().REDIS_PASSWORD}@${config().REDIS_ENDPOINT}`;

export function createRedisClient() {
  if (!_redisClient) {
    _redisClient = new Redis(redisUrl, {
      tls: { rejectUnauthorized: false },
      retryStrategy: (times) => Math.min(times * 100, 2000),
      enableReadyCheck: true,
    });

    _redisClient.on("error", (error) => {
      logError({ message: "[*] Redis", error });
    });

    _redisClient.on("ready", () => {
      // eslint-disable-next-line no-console
      console.log("Redis client ready");
    });
  }
  return getRedisInstance();
}

export function quitRedis(redisClient: Redis, timeout: number) {
  // Call redisClient.quit(), if it doesn't resolve within the specified timeout, call redisClient.disconnect()
  return new Promise<void>((resolve) => {
    const quitTimeout = setTimeout(() => {
      logWarning("Redis: Graceful quit timed out, hard disconnecting...");
      redisClient.disconnect();
      resolve();
    }, timeout);

    redisClient.quit().then(() => {
      clearTimeout(quitTimeout);
      resolve();
    });
  });
}

export function getRedisInstance() {
  invariant(_redisClient, "Redis client not initialized");
  return _redisClient;
}
