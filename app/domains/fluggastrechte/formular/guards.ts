import type { FluggastrechtContext } from "./context";
import { type Guards } from "../../guards.server";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { grundvoraussetzungenDone } from "./grundvoraussetzungen/doneFunctions";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import { prozessfuehrungDone } from "./prozessfuehrung/doneFunctions";
import { getTotalCompensationClaim } from "./services/getTotalCompensationClaim";
import { streitwertKostenDone } from "./streitwertKosten/doneFunctions";

const TOTAL_COMPENSATION_CLAIM_LIMIT = 5000;

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  grundvoraussetzungenDone,
  streitwertKostenDone,
  prozessfuehrungDone,
  hasClaimNotExceededLimit: ({ context }) =>
    TOTAL_COMPENSATION_CLAIM_LIMIT > getTotalCompensationClaim(context),
} satisfies Guards<FluggastrechtContext>;
