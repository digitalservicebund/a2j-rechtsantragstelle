import crypto from "crypto";
import {
  deleteSessionData,
  getDataForSession,
  sessionAvailable,
  setDataForSession,
  updateDataForSession,
} from "./redis";
import type { Cookie } from "@remix-run/node";
import { createSessionStorage, createCookie } from "@remix-run/node";
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

export type Context = "main" | "beratungshilfe" | "geld-einklagen";

export function createDatabaseSessionStorage({
  cookie,
  context,
}: {
  cookie: Cookie;
  context: Context;
}) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const uuid = crypto.randomUUID();
      await setDataForSession(`${context}_${uuid}`, data);
      console.log("Session created", `${context}_${uuid}`, data);
      return uuid;
    },
    async readData(id) {
      console.log("Session read", `${context}_${id}`);
      return getDataForSession(`${context}_${id}`);
    },
    async updateData(id, data, expires) {
      console.log("Session updated", `${context}_${id}`, data);
      await updateDataForSession(`${context}_${id}`, data);
    },
    async deleteData(id) {
      console.log("Session deleted", `${context}_${id}`);
      await deleteSessionData(`${context}_${id}`);
    },
  });
}

export function getSessionForContext(context: Context) {
  const { getSession, commitSession, destroySession } =
    createDatabaseSessionStorage({
      cookie: createCookie("__session", {
        secrets: [config().COOKIE_SESSION_SECRET],
        sameSite: true,
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        secure: true,
      }),
      context: context,
    });

  return { getSession, commitSession, destroySession, sessionAvailable };
}
