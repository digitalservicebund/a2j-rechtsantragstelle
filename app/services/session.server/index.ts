import crypto from "crypto";
import type { Cookie, Session } from "@remix-run/node";
import { createSessionStorage, createCookie } from "@remix-run/node";
import _ from "lodash";
import { type Context } from "~/flows/contexts";
import { flowIds, type FlowId } from "~/flows/flowIds";
import { getPrunedUserData } from "~/flows/pruner";
import { config } from "~/services/env/env.server";
import { useSecureCookie } from "~/util/useSecureCookie";
import {
  deleteSessionData,
  getDataForSession,
  setDataForSession,
  updateDataForSession,
} from "./redis";

export const allSessionContexts = [...flowIds, "main"] as const;
type SessionContext = (typeof allSessionContexts)[number];
const fullId = (context: string, id: string) => `${context}_${id}`;

function createDatabaseSessionStorage({
  cookie,
  context,
}: {
  cookie: Cookie;
  context: SessionContext;
}) {
  return createSessionStorage({
    cookie,
    async createData(data) {
      const uuid = crypto.randomUUID();
      await setDataForSession(fullId(context, uuid), data);
      return uuid;
    },
    async readData(id) {
      return await getDataForSession(fullId(context, id));
    },
    async updateData(id, data) {
      await updateDataForSession(fullId(context, id), data);
    },
    async deleteData(id) {
      await deleteSessionData(fullId(context, id));
    },
  });
}

export function getSessionManager(context: SessionContext) {
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
  const debugId = (id: string) => fullId(context, id);
  return { getSession, commitSession, destroySession, getDebugId: debugId };
}

export const getSessionData = async (
  flowId: FlowId,
  cookieHeader: CookieHeader,
) => {
  const contextSession = getSessionManager(flowId);
  const { data, id } = await contextSession.getSession(cookieHeader);
  const userData: Context = data; // Recast for now to get type safety
  return { userData, debugId: contextSession.getDebugId(id) };
};

export const getPrunedSessionData = async (
  flowId: FlowId,
  cookieHeader: CookieHeader,
) => {
  const sessionData = await getSessionData(flowId, cookieHeader);
  return {
    userData: await getPrunedUserData(sessionData.userData, flowId),
    debugId: sessionData.debugId,
  };
};

export const updateSession = (session: Session, validatedData: Context) => {
  const mergedData = _.merge(session.data, validatedData);
  Object.entries(mergedData).forEach(([key, value]) => {
    session.set(key, value);
  });
};

export type CookieHeader = string | null | undefined;
export const mainSessionFromCookieHeader = async (cookieHeader: CookieHeader) =>
  getSessionManager("main").getSession(cookieHeader);
