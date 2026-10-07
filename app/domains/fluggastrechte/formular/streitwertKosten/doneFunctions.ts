import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteUserData } from "../userData";

export const streitwertKostenDone = (context: FluggastrechteUserData) => {
  return objectKeysNonEmpty(context, ["prozesszinsen"]);
};
