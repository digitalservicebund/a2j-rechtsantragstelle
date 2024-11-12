import { type Redis } from "ioredis";

declare global {
  /* eslint-disable-next-line no-var, sonarjs/no-var*/
  var ioredis: Redis;
}

export function setRedisClient(redisClient: Redis) {
  if (!global.ioredis) global.ioredis = redisClient;
}

async function getRedisInstance() {
  return global.ioredis;
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
  if (!redisResponse) return null;
  return JSON.parse(redisResponse) as RedisData;
}

export async function deleteSessionData(uuid: string) {
  return (await getRedisInstance()).del(uuid);
}

export async function getRedisStatus() {
  return (await getRedisInstance()).status;
}
