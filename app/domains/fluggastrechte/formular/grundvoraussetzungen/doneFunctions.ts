import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtContext } from "../context";

export type FluggastrechteGrundvoraussetzungenDaten =
  GenericGuard<FluggastrechtContext>;

const hasStreitbeilegungGruende = (context: FluggastrechtContext) => {
  return (
    context.streitbeilegung === "yes" ||
    context.streitbeilegung === "noSpecification" ||
    (context.streitbeilegung === "no" &&
      objectKeysNonEmpty(context, ["streitbeilegungGruende"]))
  );
};

export const grundvoraussetzungenDone: FluggastrechteGrundvoraussetzungenDaten =
  ({ context }) => {
    return (
      objectKeysNonEmpty(context, [
        "startAirport",
        "endAirport",
        "bereich",
        "fluggesellschaft",
        "datenverarbeitungZustimmung",
        "streitbeilegung",
      ]) && hasStreitbeilegungGruende(context)
    );
  };
