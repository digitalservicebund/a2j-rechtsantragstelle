import { pack, unpack } from "./encryption";
import { getRedisInstance } from "../redis/redisClient";

const timeToLiveSeconds = 60 * 60 * 24;

type RedisData = Record<string, unknown>;

export async function setDataForSession(
  uuid: string,
  data: RedisData,
  vaultKey?: string,
) {
  const payload = pack(data, uuid, vaultKey);
  return getRedisInstance().set(uuid, payload, "EX", timeToLiveSeconds);
}

export async function updateDataForSession(
  uuid: string,
  data: RedisData,
  vaultKey?: string,
) {
  const currentData = await getDataForSession(uuid, vaultKey);
  return setDataForSession(uuid, { ...currentData, ...data }, vaultKey);
}

export async function getDataForSession(uuid: string, vaultKey?: string) {
  const redisResponse = await getRedisInstance().getBuffer(uuid);
  if (!redisResponse) return null;
  return unpack(redisResponse, uuid, vaultKey);
}

export async function deleteSessionData(uuid: string) {
  return getRedisInstance().del(uuid);
}

export function getRedisStatus() {
  return getRedisInstance().status;
}
