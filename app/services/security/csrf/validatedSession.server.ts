import type { Session } from "@remix-run/node";
import { Result } from "true-myth";
import { mainSessionFromCookieHeader } from "~/services/session.server";
import { CSRFKey } from "./csrfKey";
import { getCSRFFromSession } from "./getCSRFFromSession.server";

export const ERROR_MESSAGE_TOKEN_FORM = "Form: CSRF Token not included.";
export const ERROR_MESSAGE_TOKEN_SESSION = "Session: CSRF Token not included.";
export const ERROR_MESSAGE_TOKEN_SESSION_NOT_MATCH =
  "CSRF tokens between form and session do not match.";

async function validateCSRFToken(
  request: Request,
  session: Session,
): Promise<Result<string, string>> {
  const formData = await request.clone().formData();
  const csrfTokenForm = formData.get(CSRFKey) as string | null;

  if (!csrfTokenForm) return Result.err(ERROR_MESSAGE_TOKEN_FORM);

  const csrfTokensSession = getCSRFFromSession(session);
  if (!csrfTokensSession) return Result.err(ERROR_MESSAGE_TOKEN_SESSION);

  if (!csrfTokensSession.includes(csrfTokenForm))
    return Result.err(ERROR_MESSAGE_TOKEN_SESSION_NOT_MATCH);

  return Result.ok("OK");
}

export async function validatedSession(
  request: Request,
): Promise<Result<string, string>> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await mainSessionFromCookieHeader(cookieHeader);
  return await validateCSRFToken(request, session);
}
