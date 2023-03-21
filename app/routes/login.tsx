import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import * as crypto from "crypto";
import { getSession, commitSession } from "~/sessions";
import { Button } from "~/components";

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", crypto.randomUUID());
  return redirect("/vorabcheck", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginButton() {
  return (
    <form method="POST" name="login" action="/login">
      <Button look="tertiary" size="small">
        create session
      </Button>
    </form>
  );
}
