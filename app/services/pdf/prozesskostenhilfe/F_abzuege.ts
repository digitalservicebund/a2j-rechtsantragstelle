import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import type { PkhPdfFillFunction } from "./fillOutFunction";
import type { AttachmentEntries } from "../attachment";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../beratungshilfe/sections/E_unterhalt/E_unterhalt";

const versicherungMapping = {
  haftpflichtversicherung: "Haftpflichtversicherung",
  hausratsversicherung: "Hausratsversicherung",
  kfzVersicherung: "KFZ-Versicherung",
  pivateKrankenzusatzversicherung: "Pivate Krankenzusatzversicherung",
  unfallversicherung: "Unfallversicherung",
  sonstige: "Sonstige",
} as const;

type Versicherung = NonNullable<
  ProzesskostenhilfeFormularContext["versicherungen"]
>[number];

function mapVersicherungsArt(versicherung: Versicherung) {
  return versicherung.art === "sonstige" && versicherung.sonstigeArt
    ? versicherung.sonstigeArt
    : versicherungMapping[versicherung.art];
}

export const fillAbzuege: PkhPdfFillFunction = ({
  userData: { versicherungen, hasAusgaben },
  pdfValues,
}) => {
  if (hasAusgaben !== "yes" || !versicherungen) return { pdfValues };
  const attachment: AttachmentEntries = [];

  const versicherungenNeedsAttachment =
    versicherungen && versicherungen.length > 1;

  if (versicherungenNeedsAttachment) {
    attachment.push({ title: "Abzüge", level: "h2" });
  }

  if (versicherungenNeedsAttachment) {
    pdfValues.sonstigeVersicherungen.value = SEE_IN_ATTACHMENT_DESCRIPTION;
    attachment.push({ title: "Versicherungen", level: "h3" });
    versicherungen.forEach((versicherung) => {
      attachment.push({
        title: mapVersicherungsArt(versicherung),
        text: `${versicherung.beitrag}€ / Monat`,
      });
    });
  } else {
    pdfValues.sonstigeVersicherungen.value = mapVersicherungsArt(
      versicherungen[0],
    );
    pdfValues.monatlicheAbzuegeinEuro3.value = versicherungen[0].beitrag;
  }

  return { pdfValues, attachment };
};
