//https://sergiodxa.com/articles/adding-csrf-protection-to-remix
import type { Session } from "@remix-run/node";
import { randomBytes } from "crypto";
import { getSession } from "~/sessions";
import { CSRFKey } from "./csrf";

export function createCSRFToken() {
  return randomBytes(100).toString("base64");
}

export async function validateCSRFToken(request: Request, session: Session) {
  // first we parse the body, be sure to clone the request so you can parse the body again in the future
  const body = Object.fromEntries(
    new URLSearchParams(await request.clone().text()).entries(),
  ) as { csrf?: string };
  // then we throw an error if one of our validations didn't pass
  if (!session.has(CSRFKey))
    throw new Error("Session: CSRF Token not included.");
  if (!body.csrf) throw new Error("Body: CSRF Token not included.");
  if (body.csrf !== session.get(CSRFKey))
    throw new Error(
      `CSRF tokens do not match. body: ${body.csrf}, session: ${session.get(
        CSRFKey,
      )}`,
    );
  // we don't need to return anything, if the validation fail it will throw an error
}

export async function createCSRFSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const csrf = createCSRFToken();
  session.set(CSRFKey, csrf);
  return { session, csrf };
}

export async function validatedSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  try {
    await validateCSRFToken(request, session);
  } catch (error) {
    if (error instanceof Error) {
      session.flash("error", error.message);
      console.error(error.message);
    }
    return;
  }
  return session;
}
