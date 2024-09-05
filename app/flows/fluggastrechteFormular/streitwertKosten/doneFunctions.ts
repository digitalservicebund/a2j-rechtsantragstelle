import type { GenericGuard } from "~/flows/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtContext } from "../context";

export const streitwertKostenDone: GenericGuard<FluggastrechtContext> = ({
  context,
}) => {
  return objectKeysNonEmpty(context, [
    "versaeumnisurteil",
    "prozesszinsen",
    "aenderungMitteilung",
  ]);
};
