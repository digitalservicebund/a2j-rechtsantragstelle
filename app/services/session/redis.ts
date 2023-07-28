import { Redis } from "ioredis";
import { config } from "../env/env.server";

declare global {
  /* eslint-disable-next-line no-var*/
  var ioredis: Redis;
}

if (!global.ioredis) {
  try {
    global.ioredis = new Redis(config().REDIS_URL, {
      maxRetriesPerRequest: 1,
    });
    console.log("Redis connection opened");
  } catch (err) {
    console.error("Redis error", err);
  }
}

const timeToLiveSeconds = 60 * 60 * 24;

type RedisData = Record<string, any>;

export function sessionAvailable() {
  const { status } = global.ioredis;
  return status === "connect" || status === "ready";
}

export function setDataForSession(uuid: string, data: RedisData) {
  return ioredis.set(uuid, JSON.stringify(data), "EX", timeToLiveSeconds);
}

export async function updateDataForSession(uuid: string, data: RedisData) {
  const currentData = await getDataForSession(uuid);
  return setDataForSession(uuid, { ...currentData, ...data });
}

export async function getDataForSession(uuid: string) {
  const redisResponse = await ioredis.get(uuid);
  return redisResponse !== null
    ? (JSON.parse(redisResponse) as RedisData)
    : null;
}

export function deleteSessionData(uuid: string) {
  return ioredis.del(uuid);
}
