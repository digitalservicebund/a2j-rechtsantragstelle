//https://sergiodxa.com/articles/adding-csrf-protection-to-remix
import type { Session } from "@remix-run/node";
import { randomBytes } from "crypto";
import { getSessionForContext } from "~/services/session/";
import { CSRFKey } from "./csrf";

export function createCSRFToken() {
  return randomBytes(100).toString("base64");
}

async function validateCSRFToken(request: Request, session: Session) {
  const csrfTokenForm = (await request.clone().formData()).get(CSRFKey);
  const csrfTokenSession = session.get(CSRFKey) as string | undefined;
  if (!csrfTokenSession) throw new Error("Session: CSRF Token not included.");
  if (!csrfTokenForm) throw new Error("Form: CSRF Token not included.");
  if (csrfTokenForm !== csrfTokenSession)
    throw new Error(`CSRF tokens between form and session do not match.`);
}

export async function validatedSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await getSessionForContext("main").getSession(cookie);
  await validateCSRFToken(request, session);
}
