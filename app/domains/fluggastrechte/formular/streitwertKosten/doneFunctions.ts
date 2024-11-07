import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtContext } from "../context";

export const streitwertKostenDone: GenericGuard<FluggastrechtContext> = ({
  context,
}) => {
  return objectKeysNonEmpty(context, ["versaeumnisurteil", "prozesszinsen"]);
};
