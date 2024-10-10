//https://sergiodxa.com/articles/adding-csrf-protection-to-remix
import { randomBytes } from "node:crypto";
import {
  type CookieHeader,
  mainSessionFromCookieHeader,
} from "~/services/session.server";
import { csrfCountMax, CSRFKey } from "./csrfKey";
import { getCSRFFromSession } from "./getCSRFFromSession.server";

async function csrfSessionFromCookieHeader(
  csrf: string,
  cookieHeader: CookieHeader,
) {
  const session = await mainSessionFromCookieHeader(cookieHeader);
  const sessionCSRF = getCSRFFromSession(session);
  const newSessionCSRF = Array.isArray(sessionCSRF)
    ? [...sessionCSRF, csrf].slice(-csrfCountMax)
    : [csrf];
  session.set(CSRFKey, newSessionCSRF);
  return session;
}

function createCSRFToken() {
  // random base64 string of length 32
  return randomBytes(24).toString("base64");
}

export async function createSessionWithCsrf(cookieHeader: CookieHeader) {
  const csrf = createCSRFToken();
  const session = await csrfSessionFromCookieHeader(csrf, cookieHeader);
  return { session, csrf };
}
