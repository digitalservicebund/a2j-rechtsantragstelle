import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import * as crypto from "crypto";
import { getSession, commitSession } from "~/sessions";

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", crypto.randomUUID());
  return redirect("/form", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginButton() {
  return (
    <form method="POST" name="login" action="/login">
      <button className="ds-button ds-button-tertiary ds-button-small">
        create session
      </button>
    </form>
  );
}
