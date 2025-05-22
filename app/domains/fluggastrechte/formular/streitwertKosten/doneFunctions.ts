import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteUserData } from "../userData";

export const streitwertKostenDone: GenericGuard<FluggastrechteUserData> = ({
  context,
}) => {
  return objectKeysNonEmpty(context, ["prozesszinsen"]);
};
