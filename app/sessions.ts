import { createCookie, createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: createCookie("__session", {
      secrets: ["supers3cr3t"],
      sameSite: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      secure: true,
    }),
  });

export { getSession, commitSession, destroySession };
