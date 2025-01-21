import { type LoaderFunctionArgs, redirect } from "@remix-run/node";

const redirectionMap = {
  pkh: "/prozesskostenhilfe/direktlink",
  "pkh-feedback": "https://app.formbricks.com/s/cm4ioi9ys0013s8r3b2y3ckex",
  "studienaufruf-anwaltschaft":
    "https://app.formbricks.com/s/ovtnudms8x5290643yypu631",
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
