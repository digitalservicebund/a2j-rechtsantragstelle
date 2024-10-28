import type {
  GeldanlagenArraySchema,
  GrundeigentumArraySchema,
  KinderArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";
import type { FinanzielleAngabenGuard } from "~/flows/shared/finanzielleAngaben/guards";
import { arrayIsNonEmpty } from "~/util/array";

export const bankKontoDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" && arrayIsNonEmpty(context.bankkonten));

export const childDone = (child: KinderArraySchema[0]) =>
  child.vorname !== undefined &&
  child.nachname !== undefined &&
  child.geburtsdatum !== undefined &&
  childWohnortDone(child);

const childWohnortDone = (child: KinderArraySchema[0]) => {
  if (
    child.wohnortBeiAntragsteller === "yes" ||
    child.wohnortBeiAntragsteller === "partially"
  ) {
    return (
      child.eigeneEinnahmen === "no" ||
      (child.eigeneEinnahmen === "yes" && child.einnahmen !== undefined)
    );
  }
  return (
    child.unterhalt === "no" ||
    (child.unterhalt === "yes" && child.unterhaltsSumme !== undefined)
  );
};

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
  }
  return true;
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
