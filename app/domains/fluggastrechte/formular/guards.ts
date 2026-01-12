import type { FluggastrechteUserData } from "./userData";
import { type Guards } from "../../guards.server";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { grundvoraussetzungenDone } from "./grundvoraussetzungen/doneFunctions";
import { fluggastrechteGrundvoraussetzungenGuards } from "./grundvoraussetzungen/guard";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import { prozessfuehrungDone } from "./prozessfuehrung/doneFunctions";
import { getTotalCompensationClaim } from "./services/getTotalCompensationClaim";
import { streitwertKostenDone } from "./streitwertKosten/doneFunctions";
import { MAX_TOTAL_COMPENSATION } from "./services/isTotalClaimAboveLimit";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  ...fluggastrechteGrundvoraussetzungenGuards,
  grundvoraussetzungenDone,
  streitwertKostenDone,
  prozessfuehrungDone,
  isClaimNotExceedingLimit: ({ context }) =>
    getTotalCompensationClaim(context) < MAX_TOTAL_COMPENSATION,
} satisfies Guards<FluggastrechteUserData>;
