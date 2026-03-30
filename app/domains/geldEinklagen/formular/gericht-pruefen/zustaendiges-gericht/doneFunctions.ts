import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { getPilotCourts } from "~/domains/geldEinklagen/services/court/getPilotCourts";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { shouldVisitPilotGerichtAuswahl } from "../gericht-suchen/guards";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

export const zustaendigesGerichtDone: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  const qtyPilotCourts = getPilotCourts(context).length;

  // Only check the pilotGerichtAuswahl, if two pilot courts were selected and it should visit the two pilot courts
  if (qtyPilotCourts === 2 && shouldVisitPilotGerichtAuswahl({ context })) {
    return objectKeysNonEmpty(context, ["pilotGerichtAuswahl"]);
  }

  return qtyPilotCourts > 0;
};
