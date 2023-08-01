import crypto from "crypto";
import {
  deleteSessionData,
  getDataForSession,
  setDataForSession,
  updateDataForSession,
} from "./redis";
import type { Cookie } from "@remix-run/node";
import { createSessionStorage } from "@remix-run/node";
import { config } from "~/services/env/env.server";

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

export enum SessionContext {
  Main = "main",
  Beratungshilfe = "beratungshilfe",
  OnlineVerfahren = "onlineverfahren",
}

export function createDatabaseSessionStorage({
  cookie,
  context,
}: {
  cookie: Cookie;
  context: SessionContext;
}) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const uuid = `${context}_${crypto.randomUUID()}`;
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

export const cookieConfig = {
  secrets: [config().COOKIE_SESSION_SECRET],
  sameSite: true,
  httpOnly: true,
  maxAge: 24 * 60 * 60,
  secure: true,
};
