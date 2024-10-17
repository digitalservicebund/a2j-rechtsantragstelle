import type { KinderArraySchema } from "~/flows/shared/finanzielleAngaben/context";
import { arrayIsNonEmpty } from "~/util/array";
import type { FinanzielleAngabenGuard } from "./guards";

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
