import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteProzessfuehrungUserData } from "./userData";

export const prozessfuehrungDone: GenericGuard<
  FluggastrechteProzessfuehrungUserData
> = ({ context }) => {
  return objectKeysNonEmpty(context, [
    "hasZeugen",
    "versaeumnisurteil",
    "videoverhandlung",
  ]);
};
