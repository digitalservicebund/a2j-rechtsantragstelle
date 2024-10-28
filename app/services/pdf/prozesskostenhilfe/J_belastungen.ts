import { finanzielleAngabeEinkuenfteGuards as einkuenfteGuards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import type { PkhPdfFillFunction } from ".";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../attachment";
import { ausgabenSituationMapping } from "../beratungshilfe/sections/G_ausgaben";

export const fillBelastungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !userData.besondereBelastungen ||
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  ) {
    return { pdfValues };
  }

  const belastungen = Object.entries(userData.besondereBelastungen)
    .filter(([_, val]) => val === "on")
    .map(([key]) =>
      key in ausgabenSituationMapping
        ? ausgabenSituationMapping[key as keyof typeof ausgabenSituationMapping]
        : key,
    );

  const belastungenCount = belastungen.length;

  if (belastungenCount > 2) {
    pdfValues.besondereBelastungen.value = SEE_IN_ATTACHMENT_DESCRIPTION;
    return {
      pdfValues,
      attachment: [
        {
          title: "Besondere Belastungen",
          level: "h2",
          text: belastungen.join(", "),
        },
      ],
    };
  }

  if (belastungenCount > 0) {
    pdfValues.besondereBelastungen.value = belastungen[0];
  }
  if (belastungenCount > 1) {
    pdfValues.besondereBelastungen2.value = belastungen[1];
  }

  return { pdfValues };
};
