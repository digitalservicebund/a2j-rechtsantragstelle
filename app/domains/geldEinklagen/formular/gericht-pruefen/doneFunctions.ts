import { GenericGuard } from "~/domains/guards.server";
import { GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

export const forderungDone: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  return objectKeysNonEmpty(context, ["forderung"]);
};
