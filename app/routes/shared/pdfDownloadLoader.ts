import isEmpty from "lodash/isEmpty";
import { redirect, type LoaderFunctionArgs } from "react-router";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { beratungshilfePdfFromUserdata } from "~/domains/beratungshilfe/services/pdf";
import { parsePathname, type FlowId } from "~/domains/flowIds";
import type { FluggastrechteFlugdatenUserData } from "~/domains/fluggastrechte/formular/flugdaten/userData";
import { fluggastrechtePdfFromUserdata } from "~/domains/fluggastrechte/services/pdf/fluggastrechtePdfFromUserdata";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { prozesskostenhilfePdfFromUserdata } from "~/domains/prozesskostenhilfe/services/pdf";
import { fetchTranslations } from "~/services/cms/index.server";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { createPdfResponseHeaders } from "~/services/pdf/createPdfResponseHeaders";
import {
  getSessionData,
  getSessionIdByFlowId,
} from "~/services/session.server";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { pdfDateFormat, today } from "~/util/date";

type PdfFlowContexts =
  | BeratungshilfeFormularUserData
  | FluggastrechteFlugdatenUserData
  | ProzesskostenhilfeFormularUserData;

type PdfConfig = PdfFlowContexts extends infer T
  ? T extends PdfFlowContexts
    ? {
        pdfFunction: (
          userData: T,
          sessionId: string,
          translations?: Translations,
        ) => Promise<Uint8Array>;
        filenameFunction: () => string;
      }
    : never
  : never;

const pdfConfigs = {
  "/beratungshilfe/antrag": {
    pdfFunction: async (
      userData: BeratungshilfeFormularUserData,
      sessionId: string,
    ) => await beratungshilfePdfFromUserdata(userData, sessionId),
    filenameFunction: () =>
      `Antrag_Beratungshilfe_${pdfDateFormat(today())}.pdf`,
  },
  "/prozesskostenhilfe/formular": {
    pdfFunction: async (
      userData: ProzesskostenhilfeFormularUserData,
      _sessionId: string,
      translations?: Translations,
    ) => await prozesskostenhilfePdfFromUserdata(userData, translations),
    filenameFunction: () =>
      `Antrag_Prozesskostenhilfe_${pdfDateFormat(today())}.pdf`,
  },
  "/fluggastrechte/formular": {
    pdfFunction: async (userData: FluggastrechteFlugdatenUserData) =>
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

  const { prunedData: userData } = await pruneIrrelevantData(
    (await getSessionData(flowId, request.headers.get("Cookie"))).userData,
    flowId,
  );
  if (isEmpty(userData)) return redirect(flowId);
  const sessionId = await getSessionIdByFlowId(
    flowId,
    request.headers.get("Cookie"),
  );

  const fileContent = await pdfFunction(userData, sessionId, flowTranslations);
  const fileSize = fileContent.length;
  const filename = filenameFunction();

  return new Response(fileContent, {
    headers: createPdfResponseHeaders(filename, fileSize),
  });
}
