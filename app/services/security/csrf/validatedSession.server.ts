import type { Session } from "@remix-run/node";
import { mainSessionFromCookieHeader } from "~/services/session.server";
import { CSRFKey } from "./csrfKey";
import { getCSRFFromSession } from "./getCSRFFromSession.server";

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
