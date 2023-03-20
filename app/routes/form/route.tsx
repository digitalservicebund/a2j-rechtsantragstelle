import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { initialStepID } from "~/lib/vorabcheck";
import { getSession } from "~/sessions";
import LoginButton from "~/routes/login";
import LogoutButton from "~/routes/logout";

export const loader: LoaderFunction = async ({ request }) => {
  // Reroute to initial step on empty formStepID
  const url = new URL(request.url);
  if (url.pathname === "/form/" || url.pathname === "/form") {
    return redirect(`/form/${initialStepID}`);
  }

  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId") as string;
  return json({ userId });
};

export default function FormRoot() {
  // TODO: check whether using route as components makes sense (login/logout buttons)
  const { userId } = useLoaderData<typeof loader>();

  return (
    <main>
      {false && (
        <>
          <div>
            {!userId && <LoginButton />}
            {userId && <LogoutButton />}
            userId: {userId}
          </div>
          <header>
            <h1>Antrag Root</h1>
          </header>
        </>
      )}
      <Outlet />
    </main>
  );
}
