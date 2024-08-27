import {
  bankKontoDone,
  geldanlagenDone,
  grundeigentumDone,
  kraftfahrzeugeDone,
  wertsachenDone,
} from "~/flows/shared/finanzielleAngaben/doneFunctions";
import type { BeratungshilfeFinanzielleAngabenGuard } from "./guards";

export const eigentumZusammenfassungDone: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.staatlicheLeistungen == "grundsicherung" ||
    context.staatlicheLeistungen == "asylbewerberleistungen" ||
    (bankKontoDone({ context }) &&
      geldanlagenDone({ context }) &&
      grundeigentumDone({ context }) &&
      wertsachenDone({ context }) &&
      kraftfahrzeugeDone({ context }));
