import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { getPilotCourts } from "~/domains/geldEinklagen/services/court/getPilotCourts";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

export const zustaendigesGerichtDone: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  const qtyPilotCourts = getPilotCourts(context).length;

  return (
    qtyPilotCourts == 1 ||
    (qtyPilotCourts === 2 &&
      objectKeysNonEmpty(context, ["pilotGerichtAuswahl"]))
  );
};
