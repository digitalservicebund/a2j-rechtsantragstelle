//https://sergiodxa.com/articles/adding-csrf-protection-to-remix
import type { Session } from "@remix-run/node";
import { randomBytes } from "crypto";
import { mainSessionFromRequest } from "~/services/session.server";
import { CSRFKey } from "./csrfKey";

export const csrfCountMax = 10;

export function createCSRFToken() {
  return randomBytes(100).toString("base64");
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
  const session = await mainSessionFromRequest(request);
  await validateCSRFToken(request, session);
}

export async function csrfSessionFromRequest(csrf: string, request: Request) {
  const session = await mainSessionFromRequest(request);
  const sessionCSRF = getCSRFFromSession(session);
  const newSessionCSRF = Array.isArray(sessionCSRF)
    ? [...sessionCSRF, csrf].slice(-csrfCountMax)
    : [csrf];
  session.set(CSRFKey, newSessionCSRF);
  return session;
}
