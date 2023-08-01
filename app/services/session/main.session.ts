import { createCookie } from "@remix-run/node";
import {
  cookieConfig,
  createDatabaseSessionStorage,
  SessionContext,
} from "~/services/session";
export { sessionAvailable } from "~/services/session/redis";

// This is the main session, used for all routes that don't have a specific
// session context. An example is csrf tokens, which are used on all routes.

const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage({
    cookie: createCookie(`__session_${SessionContext.Main}`, cookieConfig),
    context: SessionContext.Main,
  });

export { getSession, commitSession, destroySession };
