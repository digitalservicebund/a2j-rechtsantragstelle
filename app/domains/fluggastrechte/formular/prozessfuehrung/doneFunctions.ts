import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteProzessfuehrungContext } from "./userData";

export const prozessfuehrungDone: GenericGuard<
  FluggastrechteProzessfuehrungContext
> = ({ context }) => {
  return objectKeysNonEmpty(context, [
    "hasZeugen",
    "versaeumnisurteil",
    "videoverhandlung",
  ]);
};
