import { arrayIsNonEmpty } from "~/util/array";
import { hasStaatlicheLeistungen } from "../einkommen/doneFunctions";
import { type BeratungshilfeFinanzielleAngabenGuard } from "../guards";

export const andereUnterhaltszahlungenDone: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    (context.staatlicheLeistungen != undefined &&
      hasStaatlicheLeistungen({ context })) ||
    context.hasWeitereUnterhaltszahlungen == "no" ||
    arrayIsNonEmpty(context.unterhaltszahlungen);
