import { andereUnterhaltszahlungenDone } from "./andereUnterhaltszahlungen/doneFunctions";
import { type BeratungshilfeFinanzielleAngabenGuard } from "./BeratungshilfeFinanzielleAngabenGuardType";
import { eigentumDone } from "./eigentum/doneFunctions";
import { einkommenDone } from "./einkommen/doneFunctions";
import { kinderDone } from "./kinder/doneFunctions";
import { partnerDone } from "./partner/doneFunctions";
import { wohnungDone } from "./wohnung/doneFunctions";

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
