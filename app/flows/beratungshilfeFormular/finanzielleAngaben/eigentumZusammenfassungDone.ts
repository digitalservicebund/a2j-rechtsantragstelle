import type { FinanzielleAngabenGuard } from "./navStates";
import {
  bankKontoDone,
  geldanlagenDone,
  grundeigentumDone,
  wertsachenDone,
  kraftfahrzeugeDone,
} from "./navStatesEigentum";

export const eigentumZusammenfassungDone: FinanzielleAngabenGuard = ({
  context,
}) =>
  context.staatlicheLeistungen == "grundsicherung" ||
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  (bankKontoDone({ context }) &&
    geldanlagenDone({ context }) &&
    grundeigentumDone({ context }) &&
    wertsachenDone({ context }) &&
    kraftfahrzeugeDone({ context }));
