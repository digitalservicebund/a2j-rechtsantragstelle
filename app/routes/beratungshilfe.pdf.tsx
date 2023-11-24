import { LoaderFunctionArgs } from "@remix-run/node";
import { BeratungshilfeAntragContext } from "~/models/flows/beratungshilfeFormular";
import {
  fillOutBeratungshilfe,
  getBeratungshilfeParameters,
} from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { getSessionForContext } from "~/services/session";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const parameters = await getBeratungshilfeParameters();

  if (!parameters) {
    return {};
  }

  const cookieId = request.headers.get("Cookie");
  const { data } = await getSessionForContext(
    "beratungshilfe/antrag",
  ).getSession(cookieId);

  const context: BeratungshilfeAntragContext = data; // Recast for now to get type safety

  try {
    parameters.bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein!.value =
      context.rechtsschutzversicherung! === "no";
  } catch (error) {
    console.error(error);
  }

  return new Response(await fillOutBeratungshilfe(parameters), {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
