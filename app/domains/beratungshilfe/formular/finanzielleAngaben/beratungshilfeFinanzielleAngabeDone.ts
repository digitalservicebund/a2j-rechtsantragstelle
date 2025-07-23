import type { BeratungshilfeFinanzielleAngabenGuard } from "./BeratungshilfeFinanzielleAngabenGuardType";
import {
  partnerDone,
  kinderDone,
  einkommenDone,
  wohnungDone,
  andereUnterhaltszahlungenDone,
  eigentumDone,
} from "./doneFunctions";

export const beratungshilfeFinanzielleAngabeDone: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) => {
    switch (context.staatlicheLeistungen) {
      case "asylbewerberleistungen":
      case "grundsicherung":
        return true;
      case "buergergeld":
        return eigentumDone({ context });
      case "keine":
        return (
          partnerDone({ context }) &&
          eigentumDone({ context }) &&
          kinderDone({ context }) &&
          eigentumDone({ context }) &&
          einkommenDone({ context }) &&
          wohnungDone({ context }) &&
          andereUnterhaltszahlungenDone({ context })
        );
      case undefined:
        return false;
    }
  };
