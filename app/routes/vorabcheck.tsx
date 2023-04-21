import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { initialStepID } from "~/lib/vorabcheck/flow.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Reroute to initial step on empty formStepID
  const url = new URL(request.url);
  if (url.pathname === "/vorabcheck/" || url.pathname === "/vorabcheck") {
    return redirect(`/vorabcheck/${initialStepID}`);
  }
  return null;
};

export default function FormRoot() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
