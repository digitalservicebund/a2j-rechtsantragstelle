import type { FinanzielleAngabenGuard } from "./guards";
import {
  bankkontenArraySchema,
  type GeldanlagenArraySchema,
  type GrundeigentumArraySchema,
} from "./userData";

export const bankKontoDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" &&
    bankkontenArraySchema.safeParse(context.bankkonten).success);

export const geldanlageDone = (geldanlage: GeldanlagenArraySchema[0]) => {
  if (
    geldanlage.art === undefined ||
    geldanlage.eigentuemer === undefined ||
    geldanlage.wert === undefined
  ) {
    return false;
  }
  switch (geldanlage.art) {
    case "giroTagesgeldSparkonto":
      return geldanlage.kontoBankName !== undefined;
    case "befristet":
      return (
        geldanlage.befristetArt !== undefined &&
        geldanlage.verwendungszweck !== undefined &&
        geldanlage.auszahlungdatum !== undefined
      );
    case "forderung":
      return geldanlage.forderung !== undefined;
    case "sonstiges":
      return geldanlage.verwendungszweck !== undefined;
    case "bargeld":
    case "wertpapiere":
    case "guthabenkontoKrypto":
      return true;
  }
};

export const singleGrundeigentumDone = (
  grundeigentum: GrundeigentumArraySchema[0],
) =>
  grundeigentum.art !== undefined &&
  grundeigentum.eigentuemer !== undefined &&
  grundeigentum.flaeche !== undefined &&
  grundeigentum.verkaufswert !== undefined &&
  (grundeigentum.isBewohnt === "yes" ||
    (grundeigentum.strassehausnummer !== undefined &&
      grundeigentum.plz !== undefined &&
      grundeigentum.ort !== undefined &&
      grundeigentum.land !== undefined));
