import { bankKontoDone } from "~/domains/shared/finanzielleAngaben/doneFunctions";
import type { BeratungshilfeFinanzielleAngabenGuard } from "./BeratungshilfeFinanzielleAngabenGuardType";
import {
  geldanlagenDone,
  grundeigentumDone,
  kraftfahrzeugeDone,
  wertsachenDone,
} from "./doneFunctions";

export const eigentumZusammenfassungDone: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.staatlicheLeistungen == "grundsicherung" ||
    context.staatlicheLeistungen == "asylbewerberleistungen" ||
    (bankKontoDone({ context }) &&
      geldanlagenDone({ context }) &&
      grundeigentumDone({ context }) &&
      wertsachenDone({ context }) &&
      kraftfahrzeugeDone({ context }));
