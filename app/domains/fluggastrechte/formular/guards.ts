import type { FluggastrechteUserData } from "./userData";
import { type Guards } from "../../guards.server";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { fluggastrechteGrundvoraussetzungenGuards } from "./grundvoraussetzungen/guard";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import { getTotalCompensationClaim } from "./services/getTotalCompensationClaim";
import { MAX_TOTAL_COMPENSATION } from "./services/isTotalClaimAboveLimit";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  ...fluggastrechteGrundvoraussetzungenGuards,
  isClaimNotExceedingLimit: ({ context }) =>
    getTotalCompensationClaim(context) < MAX_TOTAL_COMPENSATION,
} satisfies Guards<FluggastrechteUserData>;
