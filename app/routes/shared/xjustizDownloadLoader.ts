import isEmpty from "lodash/isEmpty";
import { redirect, type LoaderFunctionArgs } from "react-router";
// oxlint-disable-next-line no-unassigned-import
import "~/services/xjustiz/installTemporalPolyfill.server";
import { flows } from "~/domains/flows.server";
import { parsePathname } from "~/domains/flowIds";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { getResponsibleCourt } from "~/domains/geldEinklagen/services/court/getResponsibleCourt";
import { findGerichtByXjustizId } from "~/domains/geldEinklagen/services/xjustiz/findGerichtByXjustizId";
import { geldEinklagenXjustizFromUserdata } from "~/domains/geldEinklagen/services/xjustiz/geldEinklagenXjustizFromUserdata.server";
import { config } from "~/services/env/env.server";
import { type CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { getPrunedUserDataFromSimulation } from "~/services/flow/newFlowEngine/pruneUserData";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { pruneIrrelevantData } from "~/services/flow/pruner/pruner";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

const FLOW_ID = "/geld-einklagen/formular";

export async function loader({ request, url }: LoaderFunctionArgs) {
  const { flowId } = parsePathname(url.pathname);
  if (flowId !== FLOW_ID)
    return new Response(`No xjustiz config for flowId: ${flowId}`, {
      status: 501,
    });

  const { XJUSTIZ_TOOLS_BASE_URL } = config();
  if (XJUSTIZ_TOOLS_BASE_URL === undefined)
    return new Response("XJUSTIZ_TOOLS_BASE_URL is not configured", {
      status: 501,
    });

  const cookieHeader = request.headers.get("Cookie");
  const sessionData = await getSessionData(flowId, cookieHeader);

  let userData: GeldEinklagenFormularUserData;
  if ("newEngineConfig" in flows[flowId]) {
    const compiledStaticFlow = flows[flowId]
      .newEngineConfig as CompiledFlow<PageConfigMap>;
    userData = getPrunedUserDataFromSimulation(compiledStaticFlow, sessionData);
  } else {
    userData = pruneIrrelevantData(sessionData, flowId).prunedData;
  }
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

  if (!result.ok)
    return new Response("XJustiz-Nachricht konnte nicht erzeugt werden", {
      status: 502,
    });

  const filename = `Geld_Einklagen_Klage_${pdfDateFormat(today())}.xml`;
  return new Response(result.xjustizMessageXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
