import type { FluggastrechteUserData } from "./userData";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import { getTotalCompensationClaim } from "./services/getTotalCompensationClaim";
import { MAX_TOTAL_COMPENSATION } from "./services/isTotalClaimAboveLimit";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  isClaimNotExceedingLimit: (context) =>
    getTotalCompensationClaim(context) < MAX_TOTAL_COMPENSATION,
} satisfies Record<string, (context: FluggastrechteUserData) => boolean>;
