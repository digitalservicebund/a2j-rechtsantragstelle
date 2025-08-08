import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const checkedRequired = z.enum(["on"], customRequiredErrorMessage);

export const checkedOptional = z.enum(
  ["on", "off"],
  customRequiredErrorMessage,
);

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
      ({ ...checkboxes }) => {
        const checkboxValues = Object.entries(checkboxes)
          .filter(([key]) => key !== "none")
          .map(([, value]) => value);
        return (
          checkboxes.none === "on" || checkboxValues.some((v) => v === "on")
        );
      },
      { error: "Bitte treffen Sie eine Auswahl" },
    )
    .refine(
      ({ ...checkboxes }) => {
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
