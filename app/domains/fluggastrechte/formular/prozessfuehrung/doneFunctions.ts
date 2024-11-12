import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtProzessfuehrungContext } from "./context";

export const prozessfuehrungDone: GenericGuard<
  FluggastrechtProzessfuehrungContext
> = ({ context }) => {
  return objectKeysNonEmpty(context, [
    "versaeumnisurteil",
    "videoverhandlung",
    "schriftlichesVerfahren",
  ]);
};
