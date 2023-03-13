import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, destroySession } from "~/sessions";
import { Button } from "~/components";

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/form", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function LogoutButton() {
  return (
    <form method="POST" name="logout" action="/logout">
      <Button className="ds-button-tertiary ds-button-small">logout</Button>
    </form>
  );
}
