import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import _ from "lodash";
import { parsePathname, type FlowId } from "~/flows/flowIds";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { beratungshilfePdfFromUserdata } from "~/services/pdf/beratungshilfe";
import { prozesskostenhilfePdfFromUserdata } from "~/services/pdf/prozesskostenhilfe";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

const pdfConfigs = {
  "/beratungshilfe/antrag": {
    pdfFunction: beratungshilfePdfFromUserdata,
    filenameFunction: () =>
      `Antrag_Beratungshilfe_${pdfDateFormat(today())}.pdf`,
  },
  "/prozesskostenhilfe/formular": {
    pdfFunction: prozesskostenhilfePdfFromUserdata,
    filenameFunction: () =>
      `Antrag_Prozesskostenhilfe_${pdfDateFormat(today())}.pdf`,
  },
} as const satisfies Partial<Record<FlowId, unknown>>;

export function createHeaders(filename: string) {
  // The default character set for HTTP headers is ISO-8859-1.
  // There is however RFC 6266, describing how you can encode the file name
  // in a Content-Disposition header:
  // https://datatracker.ietf.org/doc/html/rfc6266#section-5

  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename=${encodeURIComponent(filename)}`,
  };
}

export async function pdfDownloadLoader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  if (!(flowId in pdfConfigs))
    return new Response(`No pdf config for flowId: ${flowId}`, { status: 501 });
  const { pdfFunction, filenameFunction } =
    pdfConfigs[flowId as keyof typeof pdfConfigs];

  const userData = await pruneIrrelevantData(
    (await getSessionData(flowId, request.headers.get("Cookie"))).userData,
    flowId,
  );
  if (_.isEmpty(userData)) return redirect(flowId);

  return new Response(await (await pdfFunction(userData)).save(), {
    headers: createHeaders(filenameFunction()),
  });
}
