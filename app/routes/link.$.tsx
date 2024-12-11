import { type LoaderFunctionArgs, redirect } from "@remix-run/node";

const redirectionMap = {
  pkh: "/prozesskostenhilfe/direktlink",
};

export function loader({ params }: LoaderFunctionArgs) {
  const requestedSite = params["*"];
  if (!requestedSite || !(requestedSite in redirectionMap)) {
    throw new Response(null, { status: 404 });
  }
  return redirect(redirectionMap[requestedSite as keyof typeof redirectionMap]);
}

export default function View() {
  return <></>;
}
