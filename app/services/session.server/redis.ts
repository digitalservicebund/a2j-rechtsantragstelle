import { pack, unpack } from "../redis/encryption";
import { getRedisInstance } from "../redis/redisClient";

const timeToLiveSeconds = 60 * 60 * 24;

type RedisData = Record<string, unknown>;

export async function setDataForSession(
  uuid: string,
  data: RedisData,
  userKey?: string,
) {
  const payload = pack(data, uuid, userKey);
  return getRedisInstance().set(uuid, payload, "EX", timeToLiveSeconds);
}

export async function updateDataForSession(
  uuid: string,
  data: RedisData,
  userKey?: string,
) {
  const currentData = await getDataForSession(uuid, userKey);
  return setDataForSession(uuid, { ...currentData, ...data }, userKey);
}

export async function getDataForSession(uuid: string, userKey?: string) {
  const redisResponse = await getRedisInstance().getBuffer(uuid);
  if (!redisResponse) return null;
  return unpack(redisResponse, uuid, userKey);
}

export async function deleteSessionData(uuid: string) {
  return getRedisInstance().del(uuid);
}

export function getRedisStatus() {
  return getRedisInstance().status;
}
