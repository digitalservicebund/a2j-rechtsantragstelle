/* oxlint-disable no-console */
import Redis from "ioredis";
import { singleton } from "~/util/singleton.server";
import { config } from "../env/env.server";
import { logError } from "../logging";

const REDIS_URL = `rediss://default:${config().REDIS_PASSWORD}@${config().REDIS_ENDPOINT}`;

type RedisClientProps = {
  url: string;
  lazyConnect?: boolean;
};

export function createRedisClient({ url, lazyConnect }: RedisClientProps) {
  const redisClient = new Redis(url, {
    tls: { rejectUnauthorized: false },
    retryStrategy: (times) => Math.min(times * 100, 2000),
    enableReadyCheck: true,
    lazyConnect,
  });

  redisClient.on("error", (error) => {
    logError({ message: "[*] Redis", error });
  });

  redisClient.on("ready", async () => {
    console.log("Redis client ready");
    await checkRedisVersion(redisClient);
  });

  return redisClient;
}

async function checkRedisVersion(redis: Redis) {
  try {
    const info = await redis.info("server");
    const versionRegex = /redis_version:(\d+\.\d+\.\d+)/;
    const match = versionRegex.exec(info);
    if (match) {
      console.log("Redis version:", match[1]);
    } else {
      console.log("Could not determine Redis version");
    }
  } catch (err) {
    console.error("Error fetching Redis version:", err);
  }
}

export function quitRedis(
  redisClient: Pick<Redis, "disconnect" | "quit">,
  timeout: number,
) {
  // Call redisClient.quit(), if it doesn't resolve within the specified timeout, call redisClient.disconnect()
  return new Promise<"quit" | "disconnect">((resolve) => {
    const quitTimeout = setTimeout(() => {
      redisClient.disconnect();
      resolve("disconnect");
    }, timeout);

    redisClient
      .quit()
      .then(() => {
        clearTimeout(quitTimeout);
        resolve("quit");
      })
      .catch((error) => logError({ error }));
  });
}

export function getRedisInstance() {
  return singleton("redisClient", () => createRedisClient({ url: REDIS_URL }));
}
