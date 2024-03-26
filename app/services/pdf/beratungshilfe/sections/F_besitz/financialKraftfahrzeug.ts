import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { newPageHint, type Attachment } from "../../attachment";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { eigentuemerMapping } from "./F_besitz";

type Kraftfahrzeug = NonNullable<
  BeratungshilfeFormularContext["kraftfahrzeuge"]
>[0];

export function fillFinancialKraftfahrzeug(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  if (context.kraftfahrzeuge && context.kraftfahrzeuge.length > 0) {
    fillKraftfahrzeugData(attachment, pdfFields, context.kraftfahrzeuge);
    pdfFields.f9Kraftfahrzeug1.value = false;
    pdfFields.f9Kraftfahrzeuge2.value = true;
  } else {
    pdfFields.f9Kraftfahrzeug1.value = true;
    pdfFields.f9Kraftfahrzeuge2.value = false;
  }
}

function fillKraftfahrzeugData(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  kraftfahrzeugen: Kraftfahrzeug[],
) {
  if (kraftfahrzeugen.length == 1) {
    const kraftfahrzeug = kraftfahrzeugen.pop();

    pdfFields.f10KraftfahrzeugeA.value = kraftfahrzeug?.eigentuemer == "myself";
    pdfFields.f10KraftfahrzeugB.value = kraftfahrzeug?.eigentuemer == "partner";
    pdfFields.f10KraftfahrzeugC.value =
      kraftfahrzeug?.eigentuemer == "myselfAndPartner";

    pdfFields.f11Fahrzeugart.value =
      getKraftfahrzeugShortBezeichnung(kraftfahrzeug);
    pdfFields.f12Verkehrswert.value =
      getVerkauftMappingDescription(kraftfahrzeug);
  } else {
    pdfFields.f11Fahrzeugart.value = newPageHint;
    attachment.shouldCreateAttachment = true;
    const bezeichnung: string[] = [];

    kraftfahrzeugen.forEach((kraftfahrzeug) => {
      bezeichnung.push(getKraftfahrzeugBezeichnung(kraftfahrzeug).join("\n"));
    });

    attachment.descriptions.unshift({
      title: "Kraftfahrzeuge",
      text: bezeichnung.join("\n\n"),
    });
  }
}

function getKraftfahrzeugShortBezeichnung(kraftfahrzeug?: Kraftfahrzeug) {
  const bezeichnung = [];

  if (kraftfahrzeug?.art) {
    bezeichnung.push(`${kraftfahrzeug?.art}`);
  }

  if (kraftfahrzeug?.marke) {
    bezeichnung.push(`${kraftfahrzeug?.marke}`);
  }

  if (kraftfahrzeug?.baujahr) {
    bezeichnung.push(`Baujahr: ${kraftfahrzeug?.baujahr}`);
  }

  if (kraftfahrzeug?.kilometerstand) {
    bezeichnung.push(`km-Stand: ${kraftfahrzeug?.kilometerstand}`);
  }

  bezeichnung.push(getHasArbeitWegMappingDescription(kraftfahrzeug));

  return bezeichnung.join(", ");
}

function getKraftfahrzeugBezeichnung(kraftfahrzeug?: Kraftfahrzeug) {
  const bezeichnung = [];

  if (kraftfahrzeug?.hasArbeitweg === "yes") {
    bezeichnung.push(`Fahrzeug wird für den Arbeitsweg genutzt`);
  }

  if (
    kraftfahrzeug?.eigentuemer &&
    eigentuemerMapping[kraftfahrzeug?.eigentuemer]
  ) {
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[kraftfahrzeug?.eigentuemer]}`,
    );
  }

  if (kraftfahrzeug?.art) {
    bezeichnung.push(`Art des Fahrzeugs: ${kraftfahrzeug?.art}`);
  }

  if (kraftfahrzeug?.marke) {
    bezeichnung.push(`Marke: ${kraftfahrzeug?.marke}`);
  }

  if (kraftfahrzeug?.anschaffungsjahr) {
    bezeichnung.push(`Anschaffungsjahr: ${kraftfahrzeug?.anschaffungsjahr}`);
  }

  if (kraftfahrzeug?.baujahr) {
    bezeichnung.push(`Baujahr: ${kraftfahrzeug?.baujahr}`);
  }

  if (kraftfahrzeug?.kilometerstand) {
    bezeichnung.push(
      `Kilometerstand (ca.): ${kraftfahrzeug?.kilometerstand} km`,
    );
  }

  bezeichnung.push(
    `Verkehrswert: ${getVerkauftMappingDescription(kraftfahrzeug)}`,
  );

  return bezeichnung;
}

const getVerkauftMappingDescription = (
  kraftfahrzeug?: Kraftfahrzeug,
): string => {
  if (typeof kraftfahrzeug === "undefined") {
    return "";
  }

  if (typeof kraftfahrzeug.wert === "undefined") {
    return "";
  }

  if (typeof kraftfahrzeug.hasArbeitweg === "undefined") {
    return "";
  }

  if (kraftfahrzeug.hasArbeitweg === "yes") {
    return `${kraftfahrzeug.verkaufswert}€`;
  }

  return verkaufWertMappingDescription[kraftfahrzeug.wert];
};

const verkaufWertMappingDescription = {
  under10000: "unter 10.000€",
  over10000: "Mehr als 10.000€",
  unsure: "Ich bin mir nicht sicher",
};

const getHasArbeitWegMappingDescription = (
  kraftfahrzeug?: Kraftfahrzeug,
): string => {
  if (typeof kraftfahrzeug === "undefined") {
    return "";
  }

  if (typeof kraftfahrzeug.hasArbeitweg === "undefined") {
    return "";
  }

  return hasArbeitWegMappingDescription[kraftfahrzeug.hasArbeitweg];
};

const hasArbeitWegMappingDescription = {
  yes: "Wird für den Arbeitsweg gebraucht",
  no: "Wird nicht für einen Arbeitsweg gebraucht",
};
