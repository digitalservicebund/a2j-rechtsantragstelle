import type { z } from "zod";
import type { kinderArraySchema } from "~/flows/shared/finanzielleAngaben/context";
import { arrayIsNonEmpty } from "~/util/array";
import type { FinanzielleAngabenGuard } from "./guards";

export const bankKontoDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" && arrayIsNonEmpty(context.bankkonten));

export const childDone = (
  child: Partial<z.infer<typeof kinderArraySchema>>[0],
) =>
  child !== undefined &&
  child.vorname !== "" &&
  child.nachname !== "" &&
  child.geburtsdatum !== "" &&
  childWohnortDone(child);

const childWohnortDone = (child: z.infer<typeof kinderArraySchema>[0]) => {
  if (
    child.wohnortBeiAntragsteller === "yes" ||
    child.wohnortBeiAntragsteller === "partially"
  ) {
    return (
      child.eigeneEinnahmen === "no" ||
      (child.eigeneEinnahmen === "yes" && child.einnahmen !== "")
    );
  }
  return (
    child.unterhalt === "no" ||
    (child.unterhalt === "yes" && child.unterhaltsSumme !== "")
  );
};
