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
import { useSecureCookie } from "~/util/useSecureCookie";

type SessionContext = "main" | "beratungshilfe" | "geld-einklagen";

function createDatabaseSessionStorage({
  cookie,
  context,
}: {
  cookie: Cookie;
  context: SessionContext;
}) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const uuid = crypto.randomUUID();
      await setDataForSession(`${context}_${uuid}`, data);
      return uuid;
    },
    async readData(id) {
      return getDataForSession(`${context}_${id}`);
    },
    async updateData(id, data, expires) {
      await updateDataForSession(`${context}_${id}`, data);
    },
    async deleteData(id) {
      await deleteSessionData(`${context}_${id}`);
    },
  });
}

export function getSessionForContext(context: SessionContext) {
  const { getSession, commitSession, destroySession } =
    createDatabaseSessionStorage({
      cookie: createCookie("__session", {
        secrets: [config().COOKIE_SESSION_SECRET],
        sameSite: "lax",
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        secure: useSecureCookie,
      }),
      context: context,
    });

  return { getSession, commitSession, destroySession, sessionAvailable };
}
