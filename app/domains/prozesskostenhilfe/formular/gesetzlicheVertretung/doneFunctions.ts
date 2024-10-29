import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { ProzesskostenhilfeGesetzlicheVertretung } from "./context";

export const prozesskostenhilfeGesetzlicheVertretungDone: GenericGuard<
  ProzesskostenhilfeGesetzlicheVertretung
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
