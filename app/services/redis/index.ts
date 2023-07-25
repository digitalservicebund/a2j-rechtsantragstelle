import { Redis } from "ioredis";
import { config } from "../env/env.server";
import crypto from "crypto";

declare global {
  /* eslint-disable-next-line no-var*/
  var ioredis: Redis;
}

if (!global.ioredis) {
  global.ioredis = new Redis(config().REDIS_URL, {
    maxRetriesPerRequest: null,
  });
  console.log("Redis connection opened");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addSession(data: any) {
  const uuid = crypto.randomUUID();
  const result = await global.ioredis.set(uuid, JSON.stringify(data));
  return result == "OK" ? uuid : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setDataForSession(uuid: string, data: any) {
  return global.ioredis.set(uuid, JSON.stringify(data));
}

export async function getDataForSession(uuid: string) {
  const result = await global.ioredis.get(uuid);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result !== null ? JSON.parse(result) : null;
}

export async function sessionExists(uuid: string) {
  //TODO:
}

/*
  test it in entry.server.tsx

  import { addSession, setDataForSession, getDataForSession } from "./services/redis"

  addSession("bla blubb").then(async uuid => {
    if(uuid !== null) {
      console.log(uuid)
      console.log(await getDataForSession(uuid))
      await setDataForSession(uuid, "new bla blubb")
      console.log(await getDataForSession(uuid))
    }
  }).catch(err => {console.log(err)})
*/
