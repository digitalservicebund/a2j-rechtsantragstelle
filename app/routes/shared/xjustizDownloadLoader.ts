import isEmpty from "lodash/isEmpty";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { type UserData } from "~/domains/userData";
import { config } from "~/services/env/env.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";
import { getPrunedUserDataFromSimulation } from "~/services/flow/flowEngine/pruneUserData";
import { logError } from "~/services/logging";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

export async function loader({ request, url }: LoaderFunctionArgs) {
  const { pathname } = url;
  const { flowId, currentFlow } = getPageAndFlowDataFromPathname(pathname);

  const xjustizConfig =
    "xjustizConfig" in currentFlow ? currentFlow.xjustizConfig : undefined;

  if (xjustizConfig === undefined)
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
  const userData: UserData = getPrunedUserDataFromSimulation(
    currentFlow.config,
    sessionData,
  );
  if (isEmpty(userData)) return redirect(flowId);

  const { xjustizFunction, name } = xjustizConfig;
  const result = await xjustizFunction(userData, XJUSTIZ_TOOLS_BASE_URL);

  if (result.isErr) {
    const { error } = result;
    switch (error.reason) {
      case "invalidUserData":
        logError({
          message: "XJustiz: invalid user data",
          error: error.issues,
        });
        return new Response("Ungueltige Angaben fuer die XJustiz-Nachricht", {
          status: 422,
        });
      case "noResponsibleCourt":
        return new Response("Kein zustaendiges Gericht ermittelbar", {
          status: 409,
        });
      case "xjustizToolsFailed":
        logError({
          error: "XJustiz: XJustiz-Tools failed to create the message",
        });
        return new Response("XJustiz-Nachricht konnte nicht erzeugt werden", {
          status: 502,
        });
    }
  }

  const filename = `${name}_${pdfDateFormat(today())}.xml`;
  return new Response(result.value, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
