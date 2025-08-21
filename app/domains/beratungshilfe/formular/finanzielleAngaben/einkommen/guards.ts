import { type Guards, yesNoGuards } from "~/domains/guards.server";
import {
  staatlicheLeistungenIsKeine,
  staatlicheLeistungenIsBuergergeld,
  hasAnyEigentumExceptBankaccount,
} from "~/domains/shared/formular/finanzielleAngaben/guards";
import { eigentumDone } from "../doneFunctions";
import {
  hasStaatlicheLeistungen,
  hasNoStaatlicheLeistungen,
} from "./doneFunctions";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./userData";

export const berHFinanzielleAngabenEinkommenGuards = {
  staatlicheLeistungenIsKeine,
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsBuergergeldAndEigentumDone: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) && eigentumDone({ context }),
  staatlicheLeistungenIsBuergergeldAndHasEigentum: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) &&
    hasAnyEigentumExceptBankaccount({ context }),
  hasStaatlicheLeistungen,
  hasNoStaatlicheLeistungen,
  ...yesNoGuards("erwerbstaetig"),
} satisfies Guards<BeratungshilfeFinanzielleAngabenEinkommenUserData>;
