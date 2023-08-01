import { createCookie } from "@remix-run/node";
import {
  cookieConfig,
  createDatabaseSessionStorage,
  SessionContext,
} from "~/services/session";
export { sessionAvailable } from "~/services/session/redis";

const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage({
    cookie: createCookie(
      `__session_${SessionContext.OnlineVerfahren}`,
      cookieConfig,
    ),
    context: SessionContext.OnlineVerfahren,
  });

export { getSession, commitSession, destroySession };
