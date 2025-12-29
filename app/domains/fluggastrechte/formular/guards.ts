import type { FluggastrechteUserData } from "./userData";
import { type Guards } from "../../guards.server";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { fluggastrechteGrundvoraussetzungenGuards } from "./grundvoraussetzungen/guard";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import { getTotalCompensationClaim } from "./services/getTotalCompensationClaim";

const TOTAL_COMPENSATION_CLAIM_LIMIT = 5000;

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  ...fluggastrechteGrundvoraussetzungenGuards,
  isClaimNotExceedingLimit: ({ context }) =>
    getTotalCompensationClaim(context) < TOTAL_COMPENSATION_CLAIM_LIMIT,
} satisfies Guards<FluggastrechteUserData>;
