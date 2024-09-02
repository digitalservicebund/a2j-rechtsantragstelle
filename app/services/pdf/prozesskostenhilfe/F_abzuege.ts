import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import type { PkhPdfFillFunction } from "./fillOutFunction";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../beratungshilfe/sections/E_unterhalt/E_unterhalt";

const versicherungMapping = {
  haftpflichtversicherung: "Haftpflichtversicherung",
  hausratsversicherung: "Hausratsversicherung",
  kfzVersicherung: "KFZ-Versicherung",
  pivateKrankenzusatzversicherung: "Pivate Krankenzusatzversicherung",
  unfallversicherung: "Unfallversicherung",
  sonstige: "Sonstige",
} as const;

function mapVersicherungsArt(
  versicherung: NonNullable<
    ProzesskostenhilfeFormularContext["versicherungen"]
  >[number],
) {
  return versicherung.art === "sonstige" && versicherung.sonstigeArt
    ? versicherung.sonstigeArt
    : versicherungMapping[versicherung.art];
}

export const fillAbzuege: PkhPdfFillFunction = ({
  userData: { versicherungen, hasAusgaben },
  pdfValues,
}) => {
  if (hasAusgaben !== "yes" || !versicherungen || versicherungen.length === 0)
    return { pdfValues };

  if (versicherungen.length > 1) {
    pdfValues.sonstigeVersicherungen.value = SEE_IN_ATTACHMENT_DESCRIPTION;

    return {
      pdfValues,
      attachment: [
        { title: "Abzüge", level: "h2" },
        { title: "Versicherungen", level: "h3" },
        ...versicherungen.map((versicherung) => ({
          title: mapVersicherungsArt(versicherung),
          text: `${versicherung.beitrag}€ / Monat`,
        })),
      ],
    };
  }

  pdfValues.sonstigeVersicherungen.value = mapVersicherungsArt(
    versicherungen[0],
  );
  pdfValues.monatlicheAbzuegeinEuro3.value = versicherungen[0].beitrag;

  return { pdfValues };
};
