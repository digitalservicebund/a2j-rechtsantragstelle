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
import type { Context, FlowId } from "~/models/flows/contexts";
import { fieldIsArray, splitArrayName } from "~/util/arrayVariable";

type SessionContext = "main" | FlowId;
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

export const getSessionData = async (
  flowId: SessionContext,
  cookieId: string | null,
) => {
  const contextSession = getSessionForContext(flowId);
  const { data, id } = await contextSession.getSession(cookieId);
  const userDataFromRedis: Context = data; // Recast for now to get type safety
  const sessionId = contextSession.getSessionId(id);
  return { userDataFromRedis, sessionId };
};

export const updateSession = (
  session: Session,
  validatedData: Context,
  arrayIndex?: number,
) => {
  const unflattenedArrays: Record<string, any> = {};
  Object.entries(validatedData)
    .filter(([key]) => fieldIsArray(key))
    .forEach(([key, val]) => {
      const [arrayName, fieldName] = splitArrayName(key);
      if (!(arrayName in unflattenedArrays)) unflattenedArrays[arrayName] = {};
      unflattenedArrays[arrayName][fieldName] = val;
    });

  Object.entries(unflattenedArrays).forEach(([arrayName, newArrayElement]) => {
    if (session.has(arrayName)) {
      const existingArray = session.get(arrayName) as any[];
      if (arrayIndex !== undefined && arrayIndex < existingArray.length) {
        existingArray[arrayIndex] = newArrayElement;
      } else existingArray.push(newArrayElement);
      session.set(arrayName, existingArray);
    } else {
      session.set(arrayName, [newArrayElement]);
    }
  });

  const nonArrayData = Object.fromEntries(
    Object.entries(validatedData).filter(([key]) => !fieldIsArray(key)),
  );
  const updatedData = _.merge(session.data, nonArrayData);

  Object.entries(updatedData).forEach(([key, value]) => {
    session.set(key, value);
  });
};

export const mainSessionFromRequest = async (request: Request) =>
  getSessionForContext("main").getSession(request.headers.get("Cookie"));
