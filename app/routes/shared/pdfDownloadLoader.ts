import isEmpty from "lodash/isEmpty";
import { redirect, type LoaderFunctionArgs } from "react-router";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
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
        name: string;
      }
    : never
  : never;

const pdfConfigs = {
  "/beratungshilfe/antrag": {
    pdfFunction: async (
      userData: BeratungshilfeFormularUserData,
      sessionId: string,
    ) => await beratungshilfePdfFromUserdata(userData, sessionId),
    name: `Antrag_Beratungshilfe`,
  },
  "/prozesskostenhilfe/formular": {
    pdfFunction: async (
      userData: ProzesskostenhilfeFormularUserData,
      sessionId: string,
      translations?: Translations,
    ) =>
      await prozesskostenhilfePdfFromUserdata(
        userData,
        sessionId,
        translations,
      ),
    name: `Erklaerung_Prozesskostenhilfe`,
  },
  "/fluggastrechte/formular": {
    pdfFunction: async (userData: FluggastrechteFlugdatenUserData) =>
      await fluggastrechtePdfFromUserdata(userData),
    name: `Fluggastrechte_Klage`,
  },
} satisfies Partial<Record<FlowId, PdfConfig>>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  if (!(flowId in pdfConfigs))
    return new Response(`No pdf config for flowId: ${flowId}`, { status: 501 });
  const flowTranslations = await fetchTranslations(flowId);
  const { pdfFunction, name } = pdfConfigs[flowId as keyof typeof pdfConfigs];
  const cookieHeader = request.headers.get("Cookie");

  const { prunedData: userData } = await pruneIrrelevantData(
    (await getSessionData(flowId, cookieHeader)).userData,
    flowId,
  );
  if (isEmpty(userData)) return redirect(flowId);
  const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);

  const fileContent = await pdfFunction(userData, sessionId, flowTranslations);
  const fileSize = fileContent.length;
  const filename = `${name}_${pdfDateFormat(today())}.pdf`;

  return new Response(fileContent, {
    headers: createPdfResponseHeaders(filename, fileSize),
  });
}
