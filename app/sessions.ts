import { createCookie } from "@remix-run/node";
import { createDatabaseSessionStorage } from "~/services/session";
import { config } from "~/services/env/env.server";
export { sessionAvailable } from "~/services/session/redis";

const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage({
    cookie: createCookie("__session", {
      secrets: [config().COOKIE_SESSION_SECRET],
      sameSite: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      secure: true,
    }),
  });

export { getSession, commitSession, destroySession };
