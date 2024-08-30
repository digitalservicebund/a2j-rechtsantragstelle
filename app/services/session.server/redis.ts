/* eslint-disable no-console */
import { Redis } from "ioredis";
import { config } from "../env/env.server";
import { logError } from "../logging";

declare global {
  /* eslint-disable-next-line no-var, sonarjs/no-var*/
  var ioredis: Redis;
}

const redisUrl = () =>
  `rediss://default:${config().REDIS_PASSWORD}@${config().REDIS_ENDPOINT}`;

async function getRedisInstance() {
  if (!global.ioredis) {
    try {
      global.ioredis = new Redis(redisUrl(), {
        lazyConnect: true,
        tls: {
          rejectUnauthorized: false,
        },
      });
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

type RedisData = Record<string, unknown>;

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
