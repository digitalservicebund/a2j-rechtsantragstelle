import {
  eigentumDone,
  partnerDone,
  kinderDone,
  einkommenDone,
  wohnungDone,
  andereUnterhaltszahlungenDone,
} from "./doneFunctions";
import { eigentumZusammenfassungDone } from "./eigentumZusammenfassungDone";
import type { BeratungshilfeFinanzielleAngabenGuard } from "./guards";

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
