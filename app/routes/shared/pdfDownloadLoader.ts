import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import _ from "lodash";
import type { Context } from "~/flows/contexts";
import { parsePathname, type FlowId } from "~/flows/flowIds";
import { getBeratungshilfePdfFromContext } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

const pdfConfigs = {
  "/beratungshilfe/antrag": {
    pdfFunction: getBeratungshilfePdfFromContext,
    filenameFunction: (userData: Context) =>
      `Antrag_Beratungshilfe_${userData.nachname}_${pdfDateFormat(today())}.pdf`,
  },
  "/prozesskostenhilfe/formular": {
    pdfFunction: getBeratungshilfePdfFromContext,
    filenameFunction: (userData: Context) =>
      `Antrag_Prozesskostenhilfe_${userData.nachname}_${pdfDateFormat(today())}.pdf`,
  },
} as const satisfies Partial<Record<FlowId, unknown>>;

export async function pdfDownloadLoader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");
  const { userData } = await getSessionData(flowId, cookieHeader);
  if (_.isEmpty(userData)) return redirect(flowId);
  if (!(flowId in pdfConfigs))
    return new Response(`No pdf config for flowId: ${flowId}`, { status: 501 });

  const { pdfFunction, filenameFunction } =
    pdfConfigs[flowId as keyof typeof pdfConfigs];

  return new Response(await (await pdfFunction(userData)).save(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${filenameFunction(userData)}`,
    },
  });
}
