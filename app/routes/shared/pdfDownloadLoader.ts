import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import _ from "lodash";
import type { Context } from "~/flows/contexts";
import { parsePathname, type FlowId } from "~/flows/flowIds";
import { fetchAllFormFields } from "~/services/cms/fetchAllFormFields";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { beratungshilfePdfFromUserdata } from "~/services/pdf/beratungshilfe";
import { createPdfResponseHeaders } from "~/services/pdf/createPdfResponseHeaders";
import { fluggastrechtePdfFromUserdata } from "~/services/pdf/fluggastrechte/fluggastrechtePdfFromUserdata";
import { pdfDocumentToArrayBuffer } from "~/services/pdf/pdfDocumentToArrayBuffer";
import { prozesskostenhilfePdfFromUserdata } from "~/services/pdf/prozesskostenhilfe";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

const pdfConfigs = {
  "/beratungshilfe/antrag": {
    pdfFunction: async (userData: Context) =>
      pdfDocumentToArrayBuffer(await beratungshilfePdfFromUserdata(userData)),
    filenameFunction: () =>
      `Antrag_Beratungshilfe_${pdfDateFormat(today())}.pdf`,
  },
  "/prozesskostenhilfe/formular": {
    pdfFunction: async (userData: Context) =>
      pdfDocumentToArrayBuffer(
        await prozesskostenhilfePdfFromUserdata(userData),
      ),
    filenameFunction: () =>
      `Antrag_Prozesskostenhilfe_${pdfDateFormat(today())}.pdf`,
  },
  "/fluggastrechte/formular": {
    pdfFunction: fluggastrechtePdfFromUserdata,
    filenameFunction: () =>
      `Fluggastrechte_Klage_${pdfDateFormat(today())}.pdf`,
  },
} as const satisfies Partial<Record<FlowId, unknown>>;

export async function pdfDownloadLoader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  if (!(flowId in pdfConfigs))
    return new Response(`No pdf config for flowId: ${flowId}`, { status: 501 });
  const { pdfFunction, filenameFunction } =
    pdfConfigs[flowId as keyof typeof pdfConfigs];

  const [{ userData }, formFields] = await Promise.all([
    getSessionData(flowId, request.headers.get("Cookie")),
    fetchAllFormFields(flowId),
  ]);

  const prunerUserData = pruneIrrelevantData(userData, flowId, formFields);
  if (_.isEmpty(prunerUserData)) return redirect(flowId);

  const fileContent = await pdfFunction(prunerUserData);
  const fileSize = fileContent.length;
  const filename = filenameFunction();

  return new Response(fileContent, {
    headers: createPdfResponseHeaders(filename, fileSize),
  });
}
