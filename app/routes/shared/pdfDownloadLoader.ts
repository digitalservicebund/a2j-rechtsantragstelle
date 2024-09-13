import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import _ from "lodash";
import type { Context } from "~/flows/contexts";
import { parsePathname, type FlowId } from "~/flows/flowIds";
import { beratungshilfePdfFromUserdata } from "~/services/pdf/beratungshilfe";
import { prozesskostenhilfePdfFromUserdata } from "~/services/pdf/prozesskostenhilfe";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

const pdfConfigs = {
  "/beratungshilfe/antrag": {
    pdfFunction: beratungshilfePdfFromUserdata,
    filenameFunction: (userData: Context) =>
      `Antrag_Beratungshilfe_${userData.nachname}_${pdfDateFormat(today())}.pdf`,
  },
  "/prozesskostenhilfe/formular": {
    pdfFunction: prozesskostenhilfePdfFromUserdata,
    filenameFunction: (userData: Context) =>
      `Antrag_Prozesskostenhilfe_${userData.nachname}_${pdfDateFormat(today())}.pdf`,
  },
} as const satisfies Partial<Record<FlowId, unknown>>;

export function createHeaders(filename: string) {
  // The default character set for HTTP headers is ISO-8859-1.
  // There is however RFC 6266, describing how you can encode the file name
  // in a Content-Disposition header:
  // https://datatracker.ietf.org/doc/html/rfc6266#section-5

  const encodedFilename = encodeURIComponent(filename);
  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(encodedFilename)}`,
  };
}

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

  const filename = filenameFunction(userData);

  return new Response(await (await pdfFunction(userData)).save(), {
    headers: createHeaders(filename),
  });
}
