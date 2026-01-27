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
import { flows } from "~/domains/flows.server";

export const allSessionUserData = [...flowIds, "main"] as const;
type SessionUserData = (typeof allSessionUserData)[number];
const fullId = (context: string, id: string) => `${context}_${id}`;

const DEFAULT_TIME_TO_LIVE_SECONDS = 60 * 60 * 24;

const getMaxAgeLifecycle = () => {
  let max = DEFAULT_TIME_TO_LIVE_SECONDS;
  Object.entries(flows).forEach(([flow]) => {
    const lifecycleTimeInSeconds = getLifecycleTimeBySessionUserData(
      flow as SessionUserData,
    );
    if (lifecycleTimeInSeconds > max) {
      max = lifecycleTimeInSeconds;
    }
  });
  return max;
};

export const getLifecycleTimeBySessionUserData = (context: SessionUserData) => {
  if (context === "main") return DEFAULT_TIME_TO_LIVE_SECONDS; // default for main session

  const flowConfig = flows[context];
  return "meta" in flowConfig.config &&
    "lifecycleTimeInHours" in flowConfig.config.meta
    ? (flowConfig.config.meta?.lifecycleTimeInHours as number) * 60 * 60
    : DEFAULT_TIME_TO_LIVE_SECONDS;
};

function createDatabaseSessionStorage({
  cookie,
  context,
}: {
  cookie: Cookie;
  context: SessionUserData;
}) {
  const timeToLiveSeconds = getLifecycleTimeBySessionUserData(context);

  return createSessionStorage({
    cookie,
    async createData(data) {
      const uuid = crypto.randomUUID();
      await setDataForSession(fullId(context, uuid), data, timeToLiveSeconds);
      return uuid;
    },
    async readData(id) {
      return await getDataForSession(fullId(context, id));
    },
    async updateData(id, data) {
      await updateDataForSession(fullId(context, id), data, timeToLiveSeconds);
    },
    async deleteData(id) {
      await deleteSessionData(fullId(context, id));
    },
  });
}

export function getSessionManager(context: SessionUserData) {
  const maxAge = getMaxAgeLifecycle();

  const { getSession, commitSession, destroySession } =
    createDatabaseSessionStorage({
      cookie: createCookie("__session", {
        secrets: [config().COOKIE_SESSION_SECRET],
        sameSite: "lax",
        httpOnly: true,
        maxAge,
        secure: useSecureCookie,
      }),
      context: context,
    });
  return { getSession, commitSession, destroySession };
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
