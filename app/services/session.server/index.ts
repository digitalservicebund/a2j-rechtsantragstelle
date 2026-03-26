import crypto from "node:crypto";
import { type MergeWithCustomizer } from "lodash";
import mergeWith from "lodash/mergeWith";
import type { Cookie, Session } from "react-router";
import { createSessionStorage, createCookie } from "react-router";
import { flowIds, type FlowId } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";
import { config } from "~/services/env/env.server";
import { useSecureCookie } from "~/util/useSecureCookie";
import {
  deleteSessionData,
  getDataForSession,
  setDataForSession,
  updateDataForSession,
} from "./redis";

export const allSessionUserData = [...flowIds, "main"] as const;
type SessionUserData = (typeof allSessionUserData)[number];
const fullId = (context: string, id: string) => `${context}_${id}`;

const generateUserKey = () => crypto.randomBytes(32).toString("hex");

const generateHeader = (cookies: string[]) => {
  const headers = new Headers();
  cookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
  return headers;
};

const cookie = createCookie("__session", {
  secrets: [config().COOKIE_SESSION_SECRET],
  sameSite: "lax",
  httpOnly: true,
  maxAge: 24 * 60 * 60,
  secure: useSecureCookie,
});

const vaultCookie = createCookie("__vault", {
  secrets: [config().COOKIE_SESSION_SECRET],
  sameSite: "lax",
  httpOnly: true,
  path: "/",
  maxAge: 24 * 60 * 60,
  secure: useSecureCookie,
});

const createScopedStorage = (context: SessionUserData, userKey?: string) => {
  return createSessionStorage({
    cookie,
    async createData(data) {
      const uuid = crypto.randomUUID();
      await setDataForSession(fullId(context, uuid), data, userKey);
      return uuid;
    },
    async readData(id) {
      return await getDataForSession(fullId(context, id), userKey);
    },
    async updateData(id, data) {
      await updateDataForSession(fullId(context, id), data, userKey);
    },
    async deleteData(id) {
      await deleteSessionData(fullId(context, id));
    },
  });
};

export function getSessionManager(context: SessionUserData) {
  return {
    async getSession(cookieHeader: CookieHeader) {
      const userKey =
        (await vaultCookie.parse(cookieHeader ?? null)) ?? generateUserKey();

      const storage = createScopedStorage(context, userKey);
      const session = await storage.getSession(cookieHeader);
      session.set("__vaultKey", userKey); // to pass to commitSession. Could be refactored to add cookieheader on getSessionManager()
      return session;
    },

    async commitSession(session: Session): Promise<Headers> {
      const userKey = session.get("__vaultKey");
      session.unset("__vaultKey");
      return generateHeader([
        await createScopedStorage(context, userKey).commitSession(session),
        await vaultCookie.serialize({ userKey }),
      ]);
    },

    async destroySession(session: Session): Promise<Headers> {
      return generateHeader([
        await createScopedStorage(context).destroySession(session),
        await vaultCookie.serialize("", { maxAge: 0, expires: new Date(0) }),
      ]);
    },
  };
}

export const getSessionData = async (
  flowId: FlowId,
  cookieHeader: CookieHeader,
) => ({
  userData: (await getSessionManager(flowId).getSession(cookieHeader)).data,
});

export const updateSession = (
  session: Session,
  validatedData: UserData,
  mergeCustomizer?: MergeWithCustomizer,
) => {
  const mergedData = mergeWith(session.data, validatedData, mergeCustomizer);
  Object.entries(mergedData).forEach(([key, value]) => {
    session.set(key, value);
  });
};

export const getSessionIdByFlowId = async (
  flowId: FlowId,
  cookieHeader: CookieHeader,
) => {
  const contextSession = getSessionManager(flowId);
  const { id } = await contextSession.getSession(cookieHeader);
  return id;
};

export type CookieHeader = string | null | undefined;
export const mainSessionFromCookieHeader = async (cookieHeader: CookieHeader) =>
  getSessionManager("main").getSession(cookieHeader);
