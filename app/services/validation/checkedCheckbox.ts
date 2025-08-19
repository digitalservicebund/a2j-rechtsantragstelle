import { z } from "zod";

export const checkedRequired = z.enum(["on"]);
export const checkedOptional = z.enum(["on", "off"]);

export type CheckedOptional = z.infer<typeof checkedOptional>;

export type ExclusiveCheckboxes = {
  none: CheckedOptional;
  [key: string]: CheckedOptional;
};

export const exclusiveCheckboxesSchema = (checkboxNames: string[]) =>
  z
    .object({
      ...Object.fromEntries(checkboxNames.map((c) => [c, checkedOptional])),
    })
    .refine(
      (checkboxes) => {
        return (
          checkboxes.none === "on" ||
          Object.entries(checkboxes)
            .filter(([key]) => key !== "none")
            .some(([, value]) => value === "on")
        );
      },
      { error: "Bitte treffen Sie eine Auswahl" },
    )
    .refine(
      (checkboxes) => {
        const checkboxValues = Object.entries(checkboxes)
          .filter(([key]) => key !== "none")
          .map(([, value]) => value);
        return (
          (checkboxes.none === "on" &&
            checkboxValues.every((v) => v === "off")) ||
          (checkboxes.none === "off" && checkboxValues.some((v) => v === "on"))
        );
      },
      { error: "Ungültige Kombination" },
    )
    .meta({ description: "exclusive_checkbox" });
