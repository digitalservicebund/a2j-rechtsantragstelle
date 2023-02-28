import { createCookie, createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: createCookie("__session", {
      secrets: ["supers3cr3t"],
      sameSite: true,
    }),
  });

export { getSession, commitSession, destroySession };
