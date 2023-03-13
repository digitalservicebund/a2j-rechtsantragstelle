import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, destroySession } from "~/sessions";

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
      <button className="ds-button ds-button-tertiary ds-button-small">
        logout
      </button>
    </form>
  );
}
