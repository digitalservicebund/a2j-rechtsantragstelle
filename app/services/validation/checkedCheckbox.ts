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

export const exclusiveCheckboxesSchema = (checkboxes: string[]) =>
  z
    .object({
      __component: z.literal("form-elements.exclusive-checkbox"),
      ...Object.fromEntries(checkboxes.map((c) => [c, checkedOptional])),
    })
    .describe("form-elements.exclusive-checkbox") // TODO: probier mal
    .refine(
      ({ __component, ...rest }) => {
        const checkboxValues = Object.entries(rest)
          .filter(([key]) => key !== "none")
          .map(([, value]) => value) as CheckedOptional[];
        return (
          (rest as ExclusiveCheckboxes).none === "on" ||
          checkboxValues.some((v) => v === "on")
        );
      },
      { error: "Bitte treffen Sie eine Auswahl" },
    )
    .refine(
      ({ __component, ...rest }) => {
        const checkboxValues = Object.entries(rest)
          .filter(([key]) => key !== "none")
          .map(([, value]) => value) as CheckedOptional[];
        return (
          ((rest as ExclusiveCheckboxes).none === "on" &&
            checkboxValues.every((v) => v === "off")) ||
          ((rest as ExclusiveCheckboxes).none === "off" &&
            checkboxValues.some((v) => v === "on"))
        );
      },
      { error: "Ungültige Kombination" },
    );
