import crypto from "crypto";
import {
  deleteSessionData,
  getDataForSession,
  setDataForSession,
  updateDataForSession,
} from "./redis";
import type { Cookie, Session } from "@remix-run/node";
import { createSessionStorage, createCookie } from "@remix-run/node";
import { config } from "~/services/env/env.server";
import { useSecureCookie } from "~/util/useSecureCookie";
import _ from "lodash";
import type { AllContexts } from "~/models/flows/common";

type SessionContext =
  | "main"
  | "geld-einklagen/vorabcheck"
  | "geld-einklagen/formular"
  | "beratungshilfe/vorabcheck";
const fullId = (context: SessionContext, id: string) => `${context}_${id}`;

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
      await setDataForSession(fullId(context, uuid), data);
      return uuid;
    },
    async readData(id) {
      return await getDataForSession(fullId(context, id));
    },
    async updateData(id, data, expires) {
      await updateDataForSession(fullId(context, id), data);
    },
    async deleteData(id) {
      await deleteSessionData(fullId(context, id));
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
  const getFullId = (id: string) => fullId(context, id);
  return { getSession, commitSession, destroySession, getSessionId: getFullId };
}

export const updateSession = (session: Session, validatedData: AllContexts) => {
  const updatedData = _.merge(session.data, validatedData);
  Object.entries(updatedData).forEach(([key, value]) => {
    session.set(key, value);
  });
};
