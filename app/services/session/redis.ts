import { Redis, type RedisOptions } from "ioredis";
import { config } from "../env/env.server";
import { config as configWeb } from "../env/web";
import { logError } from "../logging";

declare global {
  /* eslint-disable-next-line no-var*/
  var ioredis: Redis;
}

const useTls = ["staging", "production"].includes(configWeb().ENVIRONMENT);

const redisUrl = () =>
  `${useTls ? "rediss" : "redis"}://default:${config().REDIS_PASSWORD}@${
    config().REDIS_ENDPOINT
  }`;

async function getRedisInstance() {
  if (!global.ioredis) {
    try {
      const options = {
        lazyConnect: true,
      } satisfies RedisOptions;
      global.ioredis = new Redis(
        redisUrl(),
        useTls
          ? {
              ...options,
              tls: {
                rejectUnauthorized: false,
              },
            }
          : options,
      );
      console.log("Awaiting redis connection...");
      await global.ioredis.connect();
      console.log(`global.ioredis.status: ${global.ioredis.status}`);
    } catch (error) {
      logError({ message: "Redis error", error });
    }
  }
  return ioredis;
}

const timeToLiveSeconds = 60 * 60 * 24;

type RedisData = Record<string, any>;

export async function setDataForSession(uuid: string, data: RedisData) {
  return (await getRedisInstance()).set(
    uuid,
    JSON.stringify(data),
    "EX",
    timeToLiveSeconds,
  );
}

export async function updateDataForSession(uuid: string, data: RedisData) {
  const currentData = await getDataForSession(uuid);
  return setDataForSession(uuid, { ...currentData, ...data });
}

export async function getDataForSession(uuid: string) {
  const redisResponse = await (await getRedisInstance()).get(uuid);
  return redisResponse !== null
    ? (JSON.parse(redisResponse) as RedisData)
    : null;
}

export async function deleteSessionData(uuid: string) {
  return (await getRedisInstance()).del(uuid);
}
