import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import _ from "lodash";
import { getBeratungshilfePdfFromContext } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { getSessionData } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const flowId = "beratungshilfe/antrag";
  const { userData } = await getSessionData(flowId, cookieHeader);

  if (_.isEmpty(userData)) {
    return redirect("/beratungshilfe/antrag");
  }
  const pdfDoc = await getBeratungshilfePdfFromContext(userData);
  return new Response(await pdfDoc.save(), {
    headers: { "Content-Type": "application/pdf" },
  });
};
