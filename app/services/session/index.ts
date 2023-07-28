import crypto from "crypto";
import {
  deleteSessionData,
  getDataForSession,
  setDataForSession,
  updateDataForSession,
} from "./redis";
import type { Cookie } from "@remix-run/node";
import { createSessionStorage } from "@remix-run/node";

export async function getReturnToURL(request: Request, uuid: string) {
  const { pathname: currentPath } = new URL(request.url);
  const sessionData = await getDataForSession(uuid);
  return sessionData?.[currentPath] as Promise<string | undefined>;
}

export async function setReturnToURL(request: Request, uuid: string) {
  const { searchParams, pathname: currentPath } = new URL(request.url);
  const referer = request.headers.get("Referer");

  // save to session only when returnToHere is present in referer
  if (searchParams.get("returnToHere") !== null && referer) {
    const { pathname: refererPath } = new URL(referer);
    return updateDataForSession(uuid, { [currentPath]: refererPath });
  }
}

export function createDatabaseSessionStorage({ cookie }: { cookie: Cookie }) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const uuid = crypto.randomUUID();
      await setDataForSession(uuid, data);
      return uuid;
    },
    async readData(id) {
      return getDataForSession(id);
    },
    async updateData(id, data, expires) {
      await updateDataForSession(id, data);
    },
    async deleteData(id) {
      await deleteSessionData(id);
    },
  });
}
