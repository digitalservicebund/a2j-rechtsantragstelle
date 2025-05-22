import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { ProzesskostenhilfeGesetzlicheVertretungUserData } from "./userData";

export const prozesskostenhilfeGesetzlicheVertretungDone: GenericGuard<
  ProzesskostenhilfeGesetzlicheVertretungUserData
> = ({ context }) =>
  Boolean(
    context.hasGesetzlicheVertretung === "no" ||
      (context.hasGesetzlicheVertretung === "yes" &&
        objectKeysNonEmpty(context.gesetzlicheVertretungDaten, [
          "vorname",
          "nachname",
          "strasseHausnummer",
          "plz",
          "ort",
        ])),
  );
