import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { freibetragShort } from "~/lib/freibetrag";
import type { Context } from "~/models/flows/beratungshilfe/guards";

export const getVerfuegbaresEinkommenFreibetrag = (context: Context) => {
  const isWorking =
    context["erwerbstaetigkeit"]["isErwerbstaetig"] == YesNoAnswer.Enum.yes;
  const isInPartnership =
    context["partnerschaft"]["partnerschaft"] == YesNoAnswer.Enum.yes;
  const kidsCountTotal = parseFloat(context["kinderAnzahlKurz"]["kidsTotal"]);
  return freibetragShort(isWorking, isInPartnership, kidsCountTotal);
};
