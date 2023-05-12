import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getInitialStep } from "~/services/flow";
1;

const subdir = "vorabcheck";

export const loader: LoaderFunction = async ({ request }) => {
  // Reroute to initial step on empty formStepID
  const { pathname } = new URL(request.url);
  if (pathname === `/${subdir}/` || pathname === `/${subdir}`) {
    return redirect(`/${subdir}/${getInitialStep()}`);
  }
  return null;
};

export default () => <Outlet />;
