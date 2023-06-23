import { freibetragShort } from "~/lib/freibetrag";
import type { BeratungshilfeVorabcheckContext } from "./flows/beratungshilfe/pages";

export const getVerfuegbaresEinkommenFreibetrag = (
  context: BeratungshilfeVorabcheckContext
) => {
  const isWorking = context.erwerbstaetigkeit == "yes";
  const isInPartnership = context.partnerschaft == "yes";
  const kidsCountTotal = parseFloat(context.kinderAnzahlKurz ?? "0");
  return freibetragShort(isWorking, isInPartnership, kidsCountTotal);
};
