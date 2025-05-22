import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteUserData } from "../userData";

type FluggastrechteGrundvoraussetzungenDaten =
  GenericGuard<FluggastrechteUserData>;

const hasStreitbeilegungGruende = (context: FluggastrechteUserData) => {
  const isYes = context.streitbeilegung === "yes";
  const isNoSpecification = context.streitbeilegung === "noSpecification";
  const isNoWithReasons =
    context.streitbeilegung === "no" &&
    objectKeysNonEmpty(context, ["streitbeilegungGruende"]);

  return isYes || isNoSpecification || isNoWithReasons;
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
