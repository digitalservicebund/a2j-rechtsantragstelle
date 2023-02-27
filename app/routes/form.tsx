import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { initial } from "./form/formDefinition";

export const loader: LoaderFunction = async ({ request }) => {
  // Reroute to initial step on empty formStepID
  const url = new URL(request.url);
  if (url.pathname === "/form/" || url.pathname === "/form") {
    return redirect(`/form/${initial}`);
  }
  return null;
};

export default function FormRoot() {
  return (
    <main>
      <header>
        <h1>Antrag Root</h1>
      </header>
      <Outlet />
    </main>
  );
}
