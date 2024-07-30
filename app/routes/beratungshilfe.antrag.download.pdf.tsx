import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import _ from "lodash";
import { getPrunedUserData } from "~/flows/pruner";
import { getBeratungshilfePdfFromContext } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { getSessionData } from "~/services/session.server";
import { pdfDateFormat, today } from "~/util/date";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const flowId = "/beratungshilfe/antrag";
  const userData = await getPrunedUserData(
    (await getSessionData(flowId, cookieHeader)).userData,
    flowId,
  );

  if (_.isEmpty(userData)) {
    return redirect("/beratungshilfe/antrag");
  }
  const pdfDoc = await getBeratungshilfePdfFromContext(userData);
  const filename = `Antrag_Beratungshilfe_${userData.nachname}_${pdfDateFormat(today())}.pdf`;
  return new Response(await pdfDoc.save(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${filename}`,
    },
  });
};
