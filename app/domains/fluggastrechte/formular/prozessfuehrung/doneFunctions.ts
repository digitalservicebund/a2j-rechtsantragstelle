import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteProzessfuehrungContext } from "./context";

export const prozessfuehrungDone: GenericGuard<
  FluggastrechteProzessfuehrungContext
> = ({ context }) => {
  return objectKeysNonEmpty(context, [
    "hasZeugen",
    "versaeumnisurteil",
    "videoverhandlung",
  ]);
};
