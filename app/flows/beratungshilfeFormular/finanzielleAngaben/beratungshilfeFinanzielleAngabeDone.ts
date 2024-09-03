import type { BeratungshilfeFinanzielleAngabenGuard } from "./BeratungshilfeFinanzielleAngabenGuardType";
import {
  partnerDone,
  kinderDone,
  einkommenDone,
  wohnungDone,
  andereUnterhaltszahlungenDone,
  eigentumDone,
} from "./doneFunctions";
import { eigentumZusammenfassungDone } from "./eigentumZusammenfassungDone";

export const beratungshilfeFinanzielleAngabeDone: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) => {
    switch (context.staatlicheLeistungen) {
      case "asylbewerberleistungen":
      case "grundsicherung":
        return true;
      case "buergergeld":
        return (
          eigentumDone({ context }) && eigentumZusammenfassungDone({ context })
        );
      case "keine":
        return (
          partnerDone({ context }) &&
          eigentumDone({ context }) &&
          kinderDone({ context }) &&
          eigentumZusammenfassungDone({ context }) &&
          einkommenDone({ context }) &&
          wohnungDone({ context }) &&
          andereUnterhaltszahlungenDone({ context })
        );
    }
    return false;
  };
