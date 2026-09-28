import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { getTotalCompensationClaim } from "./services/getTotalCompensationClaim";
import { MAX_TOTAL_COMPENSATION } from "./services/isTotalClaimAboveLimit";
import type { FluggastrechteUserData } from "./userData";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  isClaimNotExceedingLimit: (context) =>
    getTotalCompensationClaim(context) < MAX_TOTAL_COMPENSATION,
} satisfies Record<string, (context: FluggastrechteUserData) => boolean>;
