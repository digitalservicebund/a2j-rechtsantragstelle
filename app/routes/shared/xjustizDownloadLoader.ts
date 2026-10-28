import isEmpty from "lodash/isEmpty";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { flows } from "~/domains/flows.server";
import { parsePathname } from "~/domains/flowIds";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { getResponsibleCourt } from "~/domains/geldEinklagen/services/court/getResponsibleCourt";
import { findGerichtByXjustizId } from "~/domains/geldEinklagen/services/xjustiz/findGerichtByXjustizId";
import { geldEinklagenXjustizFromUserdata } from "~/domains/geldEinklagen/services/xjustiz/geldEinklagenXjustizFromUserdata.server";
import { config } from "~/services/env/env.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";
import { getPrunedUserDataFromSimulation } from "~/services/flow/flowEngine/pruneUserData";
import { logError } from "~/services/logging";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

const FLOW_ID = "/geld-einklagen/formular";

export async function loader({ request, url }: LoaderFunctionArgs) {
  const { flowId } = parsePathname(url.pathname);
  if (flowId !== FLOW_ID)
    return new Response(`No xjustiz config for flowId: ${flowId}`, {
      status: 501,
    });

  await throw404IfFeatureFlagDisabled("showXjustizDownload");

  const { XJUSTIZ_TOOLS_BASE_URL } = config();
  if (XJUSTIZ_TOOLS_BASE_URL === undefined)
    return new Response("XJUSTIZ_TOOLS_BASE_URL is not configured", {
      status: 501,
    });

  const cookieHeader = request.headers.get("Cookie");
  const sessionData = await getSessionData(flowId, cookieHeader);

  const userData: GeldEinklagenFormularUserData =
    getPrunedUserDataFromSimulation(flows[flowId].config, sessionData);
  if (isEmpty(userData)) return redirect(flowId);

  const gericht = findGerichtByXjustizId(
    getResponsibleCourt(userData)?.XJUSTIZID,
  );
  if (gericht === undefined)
    return new Response("Kein zustaendiges Gericht ermittelbar", {
      status: 409,
    });

  const result = await geldEinklagenXjustizFromUserdata({
    userData,
    gericht,
    baseUrl: XJUSTIZ_TOOLS_BASE_URL,
  });

  if (!result.ok && result.reason === "invalidUserData") {
    logError({
      message: "XJustiz: invalid user data",
      error: result.issues,
    });
    return new Response("Ungueltige Angaben fuer die XJustiz-Nachricht", {
      status: 422,
    });
  }

  if (!result.ok) {
    logError({ error: "XJustiz: XJustiz-Tools failed to create the message" });
    return new Response("XJustiz-Nachricht konnte nicht erzeugt werden", {
      status: 502,
    });
  }

  const filename = `Geld_Einklagen_Klage_${pdfDateFormat(today())}.xml`;
  return new Response(result.xjustizMessageXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
