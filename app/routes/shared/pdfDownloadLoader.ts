import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import isEmpty from "lodash/isEmpty";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { beratungshilfePdfFromUserdata } from "~/domains/beratungshilfe/services/pdf";
import { parsePathname, type FlowId } from "~/domains/flowIds";
import type { FluggastrechteFlugdatenContext } from "~/domains/fluggastrechte/formular/flugdaten/context";
import { fluggastrechtePdfFromUserdata } from "~/domains/fluggastrechte/services/pdf/fluggastrechtePdfFromUserdata";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { prozesskostenhilfePdfFromUserdata } from "~/domains/prozesskostenhilfe/services/pdf";
import { fetchTranslations } from "~/services/cms/index.server";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { createPdfResponseHeaders } from "~/services/pdf/createPdfResponseHeaders";
import { getSessionData } from "~/services/session.server";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { pdfDateFormat, today } from "~/util/date";

type PdfFlowContexts =
  | BeratungshilfeFormularContext
  | FluggastrechteFlugdatenContext
  | ProzesskostenhilfeFormularContext;

export type PdfConfig = PdfFlowContexts extends infer T
  ? T extends PdfFlowContexts
    ? {
        pdfFunction: (
          userData: T,
          translations?: Translations,
        ) => Promise<Uint8Array>;
        filenameFunction: () => string;
      }
    : never
  : never;

const pdfConfigs = {
  "/beratungshilfe/antrag": {
    pdfFunction: async (userData: BeratungshilfeFormularContext) =>
      await beratungshilfePdfFromUserdata(userData),
    filenameFunction: () =>
      `Antrag_Beratungshilfe_${pdfDateFormat(today())}.pdf`,
  },
  "/prozesskostenhilfe/formular": {
    pdfFunction: async (
      userData: ProzesskostenhilfeFormularContext,
      translations?: Translations,
    ) => await prozesskostenhilfePdfFromUserdata(userData, translations),
    filenameFunction: () =>
      `Antrag_Prozesskostenhilfe_${pdfDateFormat(today())}.pdf`,
  },
  "/fluggastrechte/formular": {
    pdfFunction: async (userData: FluggastrechteFlugdatenContext) =>
      await fluggastrechtePdfFromUserdata(userData),
    filenameFunction: () =>
      `Fluggastrechte_Klage_${pdfDateFormat(today())}.pdf`,
  },
} satisfies Partial<Record<FlowId, PdfConfig>>;

export async function pdfDownloadLoader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  if (!(flowId in pdfConfigs))
    return new Response(`No pdf config for flowId: ${flowId}`, { status: 501 });
  const flowTranslations = await fetchTranslations(flowId);
  const { pdfFunction, filenameFunction } =
    pdfConfigs[flowId as keyof typeof pdfConfigs];

  const { pruneData: userData } = await pruneIrrelevantData(
    (await getSessionData(flowId, request.headers.get("Cookie"))).userData,
    flowId,
  );
  if (isEmpty(userData)) return redirect(flowId);

  const fileContent = await pdfFunction(userData, flowTranslations);
  const fileSize = fileContent.length;
  const filename = filenameFunction();

  return new Response(fileContent, {
    headers: createPdfResponseHeaders(filename, fileSize),
  });
}
