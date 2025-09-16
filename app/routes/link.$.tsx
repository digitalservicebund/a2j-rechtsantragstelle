import { type LoaderFunctionArgs, redirect } from "react-router";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";

const redirectionMap = {
  pkh: "/prozesskostenhilfe/direktlink",
  "pkh-feedback": "https://app.formbricks.com/s/cm4ioi9ys0013s8r3b2y3ckex",
  "studienaufruf-anwaltschaft":
    "https://app.formbricks.com/s/ovtnudms8x5290643yypu631",
  "anmeldung-teilnahme-kommunikationsplattform":
    "https://app.formbricks.com/s/cmf2nqcww661jtl01u8a5uo4n",
};

export function loader({ request, params }: LoaderFunctionArgs) {
  const requestedSite = params["*"];
  sendCustomAnalyticsEvent({
    request,
    eventName: "$pageview",
  });
  if (!requestedSite || !(requestedSite in redirectionMap)) {
    throw new Response(null, { status: 404 });
  }
  return redirect(redirectionMap[requestedSite as keyof typeof redirectionMap]);
}
