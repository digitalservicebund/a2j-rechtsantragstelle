import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { isSelfEmployed } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
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

export const fillAbzuege: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (userData.hasAusgaben !== "yes" || !userData.versicherungen)
    return { pdfValues };
  const attachment: AttachmentEntries = [];

  if (isSelfEmployed({ context: userData })) {
    pdfValues.monatlicheAbzuegeinEuro1.value = `${userData.selbststaendigAbzuege}€`;
    // TODO: check copy
    pdfValues.steuernSolidaritaetszuschlag1.value = "Selbstständige Abzüge";
  }

  const versicherungenNeedsAttachment =
    userData.versicherungen && userData.versicherungen.length > 1;

  if (versicherungenNeedsAttachment) {
    attachment.push({ title: "Abzüge", level: "h2" });
  }

  if (versicherungenNeedsAttachment) {
    pdfValues.sonstigeVersicherungen.value = SEE_IN_ATTACHMENT_DESCRIPTION;
    attachment.push({ title: "Versicherungen", level: "h3" });
    userData.versicherungen.forEach((versicherung) => {
      attachment.push({
        title: mapVersicherungsArt(versicherung),
        text: `${versicherung.beitrag}€ / Monat`,
      });
    });
  } else {
    pdfValues.sonstigeVersicherungen.value = mapVersicherungsArt(
      userData.versicherungen[0],
    );
    pdfValues.monatlicheAbzuegeinEuro3.value =
      userData.versicherungen[0].beitrag;
  }

  return { pdfValues, attachment };
};
