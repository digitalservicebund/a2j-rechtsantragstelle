import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { arrayIsNonEmpty } from "~/services/validation/array";
import { eigentuemerMapping } from "./F_besitz";
import { newPageHint, type Attachment } from "../../attachment";

type Kraftfahrzeug = NonNullable<
  BeratungshilfeFormularContext["kraftfahrzeuge"]
>[0];

export function fillKraftfahrzeug(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const { hasKraftfahrzeug, kraftfahrzeuge } = context;
  const hasKraftfahrzeugYes = hasKraftfahrzeug === "yes";
  pdfFields.f9Kraftfahrzeug1.value = !hasKraftfahrzeugYes;
  pdfFields.f9Kraftfahrzeuge2.value = hasKraftfahrzeugYes;

  if (hasKraftfahrzeugYes && arrayIsNonEmpty(kraftfahrzeuge))
    fillKraftfahrzeugData(attachment, pdfFields, kraftfahrzeuge);
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

  if (kraftfahrzeug?.wert !== "under10000") {
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
  }

  bezeichnung.push(getHasArbeitswegMappingDescription(kraftfahrzeug));

  return bezeichnung.join(", ");
}

function getKraftfahrzeugBezeichnung(kraftfahrzeug?: Kraftfahrzeug) {
  const bezeichnung = [];

  if (kraftfahrzeug?.hasArbeitsweg === "yes") {
    bezeichnung.push(`Fahrzeug wird für den Arbeitsweg genutzt`);
  }

  if (kraftfahrzeug?.wert !== "under10000") {
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

  if (kraftfahrzeug.wert === "under10000") {
    return verkaufswertMappingDescription[kraftfahrzeug.wert];
  }

  if (typeof kraftfahrzeug.verkaufswert === "undefined") {
    return "";
  }

  return `${kraftfahrzeug.verkaufswert}€`;
};

const verkaufswertMappingDescription = {
  under10000: "unter 10.000€",
  over10000: "Mehr als 10.000€",
  unsure: "Ich bin mir nicht sicher",
};

const getHasArbeitswegMappingDescription = (
  kraftfahrzeug?: Kraftfahrzeug,
): string => {
  if (typeof kraftfahrzeug === "undefined") {
    return "";
  }

  if (typeof kraftfahrzeug.hasArbeitsweg === "undefined") {
    return "";
  }

  return hasArbeitswegMappingDescription[kraftfahrzeug.hasArbeitsweg];
};

const hasArbeitswegMappingDescription = {
  yes: "Wird für den Arbeitsweg gebraucht",
  no: "Wird nicht für einen Arbeitsweg gebraucht",
};
