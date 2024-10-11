import type { GenericGuard } from "~/flows/guards.server";
import type { ProzesskostenhilfeGesetzlicheVertretung } from "./context";

export const prozesskostenhilfeGesetzlicheVertretungDone: GenericGuard<
  ProzesskostenhilfeGesetzlicheVertretung
> = ({ context }) =>
  Boolean(
    context.hasGesetzlicheVertretung === "no" ||
      (context.hasGesetzlicheVertretung === "yes" &&
        context.gesetzlicheVertretungDaten?.vorname &&
        context.gesetzlicheVertretungDaten?.nachname &&
        context.gesetzlicheVertretungDaten?.strasseHausnummer &&
        context.gesetzlicheVertretungDaten?.plz &&
        context.gesetzlicheVertretungDaten?.ort),
  );
