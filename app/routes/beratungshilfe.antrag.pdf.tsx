import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import _ from "lodash";
import type { BeratungshilfeAntragContext } from "~/models/flows/beratungshilfeFormular";
import {
  fillAndAppendBeratungsHilfe,
  fillOutBeratungshilfe,
  getBeratungshilfeParameters,
} from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { getSessionForContext } from "~/services/session";

const isANewAttachmentPageNeeded = (context: BeratungshilfeAntragContext) => {
  const descriptions = [];

  if (context.bereich) {
    // TODO move to strapi
    const bereichMapping = {
      authorities: "Behörden",
      living: "Wohnen",
      work: "Arbeit",
      separation: "Trennung & Unterhalt",
      trade: "Handel & Verträge",
      debt: "Schulden & Forderungen",
      inheritance: "Erben",
      criminalProcedure: "Strafverfahren",
      other: "Sonstiges",
    };

    descriptions.push({
      title: "Thema des Rechtsproblems:",
      text: bereichMapping[context.bereich],
    });
  }

  if (context.beschreibung) {
    descriptions.push({
      title: "Beschreibung Angelegenheit:",
      text: context.beschreibung,
    });
  }

  if (context.eigeninitiativeBeschreibung) {
    descriptions.push({
      title: "Eigenbemühungen:",
      text: context.eigeninitiativeBeschreibung,
    });
  } else if (context.keineEigeninitiativeBeschreibung) {
    descriptions.push({
      title: "Keine Eigenbemühung, weil:",
      text: context.keineEigeninitiativeBeschreibung,
    });
  }

  if (context.sonstiges) {
    descriptions.push({ title: "Weitere Anmerkung:", text: context.sonstiges });
  }

  return {
    shouldCreateNewPage:
      descriptions.map((x) => x.title + x.text).join(" ").length > 255,
    descriptions,
  };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const pdfFields = await getBeratungshilfeParameters();

  if (!pdfFields) {
    console.error("No pdf fields or file found for beratungshilfe!");

    return new Response("No pdf fields or file found for beratungshilfe!", {
      status: 500,
    });
  }

  const cookieId = request.headers.get("Cookie");
  const { data } = await getSessionForContext(
    "beratungshilfe/antrag",
  ).getSession(cookieId);

  const context: BeratungshilfeAntragContext = data; // Recast for now to get type safety

  if (_.isEmpty(context)) {
    console.error("No context found - please restart flow");

    return redirect("/beratungshilfe/antrag");
  }

  const { shouldCreateNewPage, descriptions } =
    isANewAttachmentPageNeeded(context);

  try {
    pdfFields.bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein!.value =
      context.rechtsschutzversicherung === "no";
    pdfFields.b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden!.value =
      context.beratungshilfeBeantragt === "no";
    pdfFields.b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen!.value =
      context.eigeninitiativeGrundvorraussetzung === "yes";
    pdfFields.b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt!.value =
      context.klageEingereicht === "no";

    if (shouldCreateNewPage) {
      pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern!.value =
        "Bitte im Anhang prüfen";
    } else {
      pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern!.value =
        descriptions.map((x) => `${x.title} ${x.text}`).join("\n");
    }
  } catch (error) {
    console.error(error);
  }

  const pdfResponse = shouldCreateNewPage
    ? fillAndAppendBeratungsHilfe(pdfFields, descriptions)
    : fillOutBeratungshilfe(pdfFields);

  return new Response(await pdfResponse, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
