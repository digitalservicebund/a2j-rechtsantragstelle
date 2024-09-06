//https://sergiodxa.com/articles/adding-csrf-protection-to-remix
import { randomBytes } from "node:crypto";
import type { Session } from "@remix-run/node";
import {
  type CookieHeader,
  mainSessionFromCookieHeader,
} from "~/services/session.server";
import { csrfCountMax, CSRFKey } from "./csrfKey";

function createCSRFToken() {
  // random base64 string of length 32
  return randomBytes(24).toString("base64");
}

const getCSRFFromSession = (session: Session) =>
  session.get(CSRFKey) as string[] | null;

async function validateCSRFToken(request: Request, session: Session) {
  const formData = await request.clone().formData();
  const csrfTokenForm = formData.get(CSRFKey) as string | null;
  const csrfTokensSession = getCSRFFromSession(session);
  if (!csrfTokensSession) throw new Error("Session: CSRF Token not included.");
  if (!csrfTokenForm) throw new Error("Form: CSRF Token not included.");
  if (!csrfTokensSession.includes(csrfTokenForm))
    throw new Error(`CSRF tokens between form and session do not match.`);
}

export async function validatedSession(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await mainSessionFromCookieHeader(cookieHeader);
  await validateCSRFToken(request, session);
}

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

export async function createSessionWithCsrf(cookieHeader: CookieHeader) {
  const csrf = createCSRFToken();
  const session = await csrfSessionFromCookieHeader(csrf, cookieHeader);
  return { session, csrf };
}
