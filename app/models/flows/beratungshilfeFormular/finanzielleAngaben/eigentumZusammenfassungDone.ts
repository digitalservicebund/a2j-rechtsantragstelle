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
  bankKontoDone({ context }) &&
  geldanlagenDone({ context }) &&
  grundeigentumDone({ context }) &&
  wertsachenDone({ context }) &&
  kraftfahrzeugeDone({ context });
