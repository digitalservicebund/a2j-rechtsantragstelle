//https://sergiodxa.com/articles/adding-csrf-protection-to-remix
import type { Session } from "@remix-run/node";
import { randomBytes } from "crypto";
import { getSession } from "~/services/session/main.session";
import { CSRFKey } from "./csrf";

export function createCSRFToken() {
  return randomBytes(100).toString("base64");
}

async function validateCSRFToken(request: Request, session: Session) {
  const bodyToken = (await request.clone().formData()).get(CSRFKey);
  const sessionToken = session.get(CSRFKey) as string | undefined;
  if (!sessionToken) throw new Error("Session: CSRF Token not included.");
  if (!bodyToken) throw new Error("Body: CSRF Token not included.");
  if (bodyToken !== session.get(CSRFKey))
    throw new Error(`CSRF tokens between body and session do not match.`);
}

export async function validatedSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  try {
    await validateCSRFToken(request, session);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return;
  }
  return session;
}
