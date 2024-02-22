import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import _ from "lodash";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfePdfFromContext } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { getSessionForContext } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieId = request.headers.get("Cookie");
  const { data } = await getSessionForContext(
    "beratungshilfe/antrag",
  ).getSession(cookieId);

  const context: BeratungshilfeFormularContext = data; // Recast for now to get type safety

  if (_.isEmpty(context)) {
    return redirect("/beratungshilfe/antrag");
  }

  return new Response(await getBeratungshilfePdfFromContext(context), {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
