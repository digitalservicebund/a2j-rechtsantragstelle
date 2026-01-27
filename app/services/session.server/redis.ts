import { getRedisInstance } from "../redis/redisClient";

type RedisData = Record<string, unknown>;

export async function setDataForSession(
  uuid: string,
  data: RedisData,
  timeToLiveSeconds: number,
) {
  return getRedisInstance().set(
    uuid,
    JSON.stringify(data),
    "EX",
    timeToLiveSeconds,
  );
}

export async function updateDataForSession(
  uuid: string,
  data: RedisData,
  timeToLiveSeconds: number,
) {
  const currentData = await getDataForSession(uuid);
  return setDataForSession(
    uuid,
    { ...currentData, ...data },
    timeToLiveSeconds,
  );
}

export async function getDataForSession(uuid: string) {
  const redisResponse = await getRedisInstance().get(uuid);
  if (!redisResponse) return null;
  return JSON.parse(redisResponse) as RedisData;
}

export async function deleteSessionData(uuid: string) {
  return getRedisInstance().del(uuid);
}

export function getRedisStatus() {
  return getRedisInstance().status;
}
