import { getRedisInstance } from "../redis/redisClient";

const timeToLiveSeconds = 60 * 60 * 24;

type RedisData = Record<string, unknown>;

export async function setDataForSession(uuid: string, data: RedisData) {
  return getRedisInstance().set(
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
  const redisResponse = await getRedisInstance().get(uuid);
  if (!redisResponse) return null;
  return JSON.parse(redisResponse) as RedisData;
}

export async function deleteSessionData(uuid: string) {
  return getRedisInstance().del(uuid);
}

export async function getRedisStatus() {
  return getRedisInstance().status;
}
