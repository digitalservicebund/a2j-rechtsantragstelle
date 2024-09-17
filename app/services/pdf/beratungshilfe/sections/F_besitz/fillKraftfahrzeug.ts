import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import type { BerHPdfFillFunction } from "../..";
import { newPageHint, type AttachmentEntries } from "../../../attachment";
import { eigentuemerMapping } from "../../eigentuemerMapping";

function singleKraftfahrzeug(
  kraftfahrzeug: NonNullable<
    BeratungshilfeFormularContext["kraftfahrzeuge"]
  >[0],
) {
  let description = `Wird ${kraftfahrzeug.hasArbeitsweg === "no" ? "nicht " : ""}für Arbeitsweg gebraucht`;
  if (kraftfahrzeug.art) description += `, Art: ${kraftfahrzeug.art}`;
  if (kraftfahrzeug.marke) description += `, Marke: ${kraftfahrzeug.marke}`;
  if (kraftfahrzeug.baujahr)
    description += `, Baujahr: ${kraftfahrzeug.baujahr}`;
  if (kraftfahrzeug.anschaffungsjahr)
    description += `, Anschaffungsjahr: ${kraftfahrzeug.anschaffungsjahr}`;
  if (kraftfahrzeug.kilometerstand)
    description += `, Kilometerstand: ${kraftfahrzeug.kilometerstand}`;
  return description;
}

export const fillKraftfahrzeug: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const attachment: AttachmentEntries = [];
  const { kraftfahrzeuge } = userData;
  const hasKraftfahrzeugYes = kraftfahrzeuge && kraftfahrzeuge.length > 0;
  pdfValues.f9Kraftfahrzeug1.value = !hasKraftfahrzeugYes;
  pdfValues.f9Kraftfahrzeuge2.value = hasKraftfahrzeugYes;

  if (!hasKraftfahrzeugYes) return { pdfValues };

  if (kraftfahrzeuge.length == 1) {
    const kraftfahrzeug = kraftfahrzeuge[0];
    pdfValues.f10KraftfahrzeugeA.value = kraftfahrzeug.eigentuemer == "myself";
    pdfValues.f10KraftfahrzeugB.value = kraftfahrzeug.eigentuemer == "partner";
    pdfValues.f10KraftfahrzeugC.value =
      kraftfahrzeug.eigentuemer == "myselfAndPartner";

    pdfValues.f11Fahrzeugart.value = singleKraftfahrzeug(kraftfahrzeug);

    pdfValues.f12Verkehrswert.value = kraftfahrzeug.verkaufswert
      ? kraftfahrzeug.verkaufswert + " €"
      : verkaufswertMappingDescription[kraftfahrzeug.wert];
  } else {
    pdfValues.f11Fahrzeugart.value = newPageHint;
    attachment.push({
      title: "Kraftfahrzeuge",
      level: "h3",
    });
    kraftfahrzeuge.forEach((kraftfahrzeug, index) => {
      attachment.push(
        {
          title: `Kraftfahrzeug ${index + 1}`,
          level: "h4",
        },
        {
          title: "Verkaufswert",
          text: kraftfahrzeug.verkaufswert
            ? kraftfahrzeug.verkaufswert + " €"
            : verkaufswertMappingDescription[kraftfahrzeug.wert],
        },
        {
          title: "Wird für Arbeitsweg benutzt",
          text: kraftfahrzeug.hasArbeitsweg === "yes" ? "Ja" : "Nein",
        },
      );

      if (kraftfahrzeug.eigentuemer)
        attachment.push({
          title: "Eigentümer:in",
          text: eigentuemerMapping[kraftfahrzeug.eigentuemer],
        });
      if (kraftfahrzeug.art)
        attachment.push({ title: "Art", text: kraftfahrzeug.art });
      if (kraftfahrzeug.marke)
        attachment.push({ title: "Marke", text: kraftfahrzeug.marke });
      if (kraftfahrzeug.anschaffungsjahr)
        attachment.push({
          title: "Anschaffungsjahr",
          text: String(kraftfahrzeug.anschaffungsjahr),
        });
      if (kraftfahrzeug.baujahr)
        attachment.push({
          title: "Baujahr",
          text: String(kraftfahrzeug.baujahr),
        });
      if (kraftfahrzeug.kilometerstand)
        attachment.push({
          title: "Kilometerstand",
          text: String(kraftfahrzeug.kilometerstand) + " km",
        });
    });
  }
  return { pdfValues, attachment };
};

const verkaufswertMappingDescription = {
  under10000: "unter 10.000€",
  over10000: "Mehr als 10.000€",
  unsure: "Unsicher",
};
