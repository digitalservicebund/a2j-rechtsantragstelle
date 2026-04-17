import crypto, { randomBytes } from "node:crypto";
import { type MergeWithCustomizer } from "lodash";
import mergeWith from "lodash/mergeWith";
import type { Session } from "react-router";
import { createSessionStorage, createCookie } from "react-router";
import { flowIds, parsePathname, type FlowId } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";
import { config } from "~/services/env/env.server";
import { useSecureCookie } from "~/util/useSecureCookie";
import {
  deleteSessionData,
  getDataForSession,
  setDataForSession,
  updateDataForSession,
} from "./redis";
import { lastStepKey } from "~/services/flow/constants";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { getCSRFFromSession } from "~/services/security/csrf/getCSRFFromSession.server";
import { getFeedbackData } from "~/services/feedback/getFeedbackData";
import { trackingCookieValue } from "~/services/analytics/gdprCookie.server";
import { shouldSetCacheControlHeader } from "~/util/shouldSetCacheControlHeader";
import { cacheControlHeaderKey } from "~/rootHeaders";

export const allSessionUserData = [...flowIds, "main"] as const;
type SessionUserData = (typeof allSessionUserData)[number];
const fullId = (context: string, id: string) => `${context}_${id}`;

const generateVaultKey = () => crypto.randomBytes(32).toString("hex");

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

const vaultCookie = createCookie("__vaultKey", {
  secrets: [config().COOKIE_SESSION_SECRET],
  sameSite: "lax",
  httpOnly: true,
  maxAge: 24 * 60 * 60,
  secure: useSecureCookie,
});

const createScopedStorage = (context: SessionUserData, vaultKey?: string) => {
  return createSessionStorage({
    cookie,
    async createData(data) {
      const uuid = crypto.randomUUID();
      await setDataForSession(fullId(context, uuid), data, vaultKey);
      return uuid;
    },
    async readData(id) {
      return await getDataForSession(fullId(context, id), vaultKey);
    },
    async updateData(id, data) {
      await updateDataForSession(fullId(context, id), data, vaultKey);
    },
    async deleteData(id) {
      await deleteSessionData(fullId(context, id));
    },
  });
};

export function getSessionManager(context: SessionUserData) {
  return {
    async getSession(cookieHeader: CookieHeader) {
      const vaultKey: string =
        (await vaultCookie.parse(cookieHeader ?? null)) ?? generateVaultKey();

      const storage = createScopedStorage(context, vaultKey);
      const session = await storage.getSession(cookieHeader);
      session.set("__vaultKey", vaultKey); // to pass to commitSession. Should be refactored to add cookieHeader on getSessionManager()
      return session;
    },

    async commitSession(session: Session): Promise<Headers> {
      const vaultKey: string = session.get("__vaultKey");
      session.unset("__vaultKey");
      return generateHeader([
        await createScopedStorage(context, vaultKey).commitSession(session),
        await vaultCookie.serialize(vaultKey),
      ]);
    },

    async destroySession(session: Session): Promise<Headers> {
      return generateHeader([
        await createScopedStorage(context).destroySession(session),
      ]);
    },
  };
}

export const getSessionData = async (
  flowId: FlowId,
  cookieHeader: CookieHeader,
) => (await getSessionManager(flowId).getSession(cookieHeader)).data;

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
) => (await getSessionManager(flowId).getSession(cookieHeader)).id;

export type CookieHeader = ReturnType<Headers["get"]>;
export const mainSessionFromCookieHeader = async (cookieHeader: CookieHeader) =>
  getSessionManager("main").getSession(cookieHeader);

export const initializeMainSession = async (
  request: Request,
  pathname: string,
) => {
  const mainSession = await mainSessionFromCookieHeader(
    request.headers.get("Cookie"),
  );

  if (!getCSRFFromSession(mainSession)) {
    mainSession.set(CSRFKey, randomBytes(24).toString("base64"));
  }

  try {
    const { flowId, stepId } = parsePathname(pathname);
    const lastSteps = mainSession.get(lastStepKey);
    mainSession.set(lastStepKey, { ...lastSteps, [flowId]: stepId });
    // oxlint-disable-next-line no-unused-vars
  } catch (err) {} //NOSONAR

  const headers = await getSessionManager("main").commitSession(mainSession);
  const trackingConsent = await trackingCookieValue({ request });

  headers.set(
    cacheControlHeaderKey,
    String(shouldSetCacheControlHeader(pathname, trackingConsent)),
  );

  const feedback = getFeedbackData(mainSession, pathname);
  const csrf = mainSession.get(CSRFKey);
  return {
    headers,
    feedback,
    csrf,
    trackingConsent,
  };
};
