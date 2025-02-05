import type { FluggastrechtContext } from "./context";
import { type Guards } from "../../guards.server";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { grundvoraussetzungenDone } from "./grundvoraussetzungen/doneFunctions";
import { fluggastrechteGrundvoraussetzungenGuards } from "./grundvoraussetzungen/guard";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import { prozessfuehrungDone } from "./prozessfuehrung/doneFunctions";
import { getTotalCompensationClaim } from "./services/getTotalCompensationClaim";
import { streitwertKostenDone } from "./streitwertKosten/doneFunctions";

const TOTAL_COMPENSATION_CLAIM_LIMIT = 5000;

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  ...fluggastrechteGrundvoraussetzungenGuards,
  grundvoraussetzungenDone,
  streitwertKostenDone,
  prozessfuehrungDone,
  isClaimNotExceedingLimit: ({ context }) =>
    getTotalCompensationClaim(context) < TOTAL_COMPENSATION_CLAIM_LIMIT,
} satisfies Guards<FluggastrechtContext>;
