import { LoaderFunctionArgs } from "@remix-run/node";
import { BeratungshilfeAntragContext } from "~/models/flows/beratungshilfeFormular";
import {
  fillOutBeratungshilfe,
  getBeratungshilfeParameters,
} from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { getSessionForContext } from "~/services/session";

const handleBeschreibungText = (context: BeratungshilfeAntragContext) => {
  if (context.beschreibung && context.beschreibung.length <= 255) {
    return context.beschreibung;
  }

  return "Please see new attachment";
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const pdfFields = await getBeratungshilfeParameters();

  if (!pdfFields) {
    //TODO: This should return a non-recoverable error, because it requires a PDF to fulfill the job
    return {};
  }

  const cookieId = request.headers.get("Cookie");
  const { data } = await getSessionForContext(
    "beratungshilfe/antrag",
  ).getSession(cookieId);

  const context: BeratungshilfeAntragContext = data; // Recast for now to get type safety

  try {
    pdfFields.bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein!.value =
      context.rechtsschutzversicherung === "no";
    pdfFields.b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden!.value =
      context.beratungshilfeBeantragt === "no";
    pdfFields.b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen!.value =
      context.eigeninitiativeGrundvorraussetzung === "yes";
    pdfFields.b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt!.value =
      context.klageEingereicht === "no";
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern!.value =
      handleBeschreibungText(context);
  } catch (error) {
    console.error(error);
  }

  return new Response(await fillOutBeratungshilfe(pdfFields), {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
