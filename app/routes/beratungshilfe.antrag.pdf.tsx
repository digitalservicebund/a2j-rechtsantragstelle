import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import _ from "lodash";
import type { BeratungshilfeAntragContext } from "~/models/flows/beratungshilfeFormular";
import {
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

function getSelectedOptions(
  mapping: { [key: string]: string },
  options?: { [key: string]: "on" | "off" },
) {
  if (!options) {
    return "";
  }

  return Object.entries(options)
    .map(([key, value]) => {
      if (value === "on") {
        return mapping[key];
      }
      return "";
    })
    .filter((entry) => entry)
    .join(", ");
}

const getOccupationDetails = (context: BeratungshilfeAntragContext) => {
  const description: string[] = [];

  if (context.erwerbstaetig === "no") {
    description.push("nicht erwerbstätig");
  } else if (context.berufart) {
    const occupation = "Erwerbstätig";
    const occupationTypeSelected = getSelectedOptions(
      {
        selbststaendig: "selbstständig",
        festangestellt: "festangestellt",
      },
      context.berufart,
    );

    description.push(
      `${occupation}${
        occupationTypeSelected ? " (" + occupationTypeSelected + ")" : ""
      }`,
    );
  }

  const berufsituationMapping = {
    no: "",
    pupil: "Schüler:in",
    student: "Student:in",
    retiree: "Rentner:in",
  };

  description.push(berufsituationMapping[context.berufsituation ?? "no"]);

  if (context.weitereseinkommen) {
    const otherIncomes = getSelectedOptions(
      {
        unterhaltszahlungen: "Unterhaltszahlungen",
        wohngeld: "Wohngeld",
        kindergeld: "Kindergeld",
        bafoeg: "Bafög",
        others: "Sonstiges",
      },
      context.weitereseinkommen,
    );

    description.push(otherIncomes);
  }

  return description.filter((value) => value).join(", ");
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

  try {
    pdfFields.bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein!.value =
      context.rechtsschutzversicherung === "no";
    pdfFields.b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden!.value =
      context.beratungshilfeBeantragt === "no";
    pdfFields.b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen!.value =
      context.eigeninitiativeGrundvorraussetzung === "no";
    pdfFields.b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt!.value =
      context.klageEingereicht === "no";
    pdfFields.c2Einkuenftenetto!.value = context.einkommen;
    pdfFields.antragstellerNameVornameggfGeburtsname!.value = `${context.nachname}, ${context.vorname} `;
    pdfFields.geburtsdatumdesAntragstellers!.value = context.geburtsdatum;
    pdfFields.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers!.value = `${context.strasseHausnummer}, ${context.plz}, ${context.ort} `;
    pdfFields.tagsueberTelefonischerreichbarunterNummer!.value =
      context.telefonnummer;
    pdfFields.berufErwerbstaetigkeit!.value = getOccupationDetails(context);

    const attachment = isANewAttachmentPageNeeded(context);

    if (attachment.shouldCreateNewPage) {
      pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern!.value =
        "Bitte im Anhang prüfen";
    } else {
      pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern!.value =
        attachment.descriptions.map((x) => `${x.title} ${x.text} `).join("\n");
    }

    if (pdfFields.berufErwerbstaetigkeit!.value.length > 30) {
      attachment.shouldCreateNewPage = true;
      attachment.descriptions.unshift({
        title: "Beruf / Erwerbstätigkeit:",
        text: pdfFields.berufErwerbstaetigkeit!.value,
      });
      pdfFields.berufErwerbstaetigkeit!.value = "Bitte im Anhang prüfen";
    }
    const pdfResponse = fillOutBeratungshilfe(
      pdfFields,
      attachment.descriptions,
      attachment.shouldCreateNewPage,
    );

    return new Response(await pdfResponse, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error(error);
  }

  return new Response("Error while generating PDF");
};
