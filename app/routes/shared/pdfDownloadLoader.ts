import isEmpty from "lodash/isEmpty";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { type UserData } from "~/domains/userData";
import { fetchTranslations } from "~/services/cms/index.server";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";
import { getPrunedUserDataFromSimulation } from "~/services/flow/newFlowEngine/pruneUserData";
import { createPdfResponseHeaders } from "~/services/pdf/createPdfResponseHeaders";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

export async function loader({ request, url }: LoaderFunctionArgs) {
  const { pathname } = url;
  const { flowId, currentFlow } = getPageAndFlowDataFromPathname(pathname);
  const cookieHeader = request.headers.get("Cookie");

  const pdfConfig =
    "pdfConfig" in currentFlow ? currentFlow.pdfConfig : undefined;

  if (pdfConfig === undefined)
    return new Response(`No pdf config for flowId: ${flowId}`, { status: 501 });

  const [flowTranslations, sessionData] = await Promise.all([
    fetchTranslations(flowId),
    getSessionData(flowId, cookieHeader),
  ]);

  const compiledStaticFlow = currentFlow.newEngineConfig;
  const userData: UserData = getPrunedUserDataFromSimulation(
    compiledStaticFlow,
    sessionData,
  );
  if (isEmpty(userData)) return redirect(flowId);

  const { pdfFunction, name } = pdfConfig;
  const fileContent = await pdfFunction(userData, flowTranslations);
  const fileSize = fileContent.length;
  const filename = `${name}_${pdfDateFormat(today())}.pdf`;

  return new Response(Buffer.from(fileContent), {
    headers: createPdfResponseHeaders(filename, fileSize),
  });
}
