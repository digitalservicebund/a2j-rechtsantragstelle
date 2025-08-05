import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const checkedRequired = z.enum(["on"], customRequiredErrorMessage);

export const checkedOptional = z.enum(
  ["on", "off"],
  customRequiredErrorMessage,
);

type ExclusiveCheckboxes = {
  none: z.infer<typeof checkedOptional>;
  [key: string]: z.infer<typeof checkedOptional>;
};

export const exclusiveCheckboxesSchema = (checkboxes: string[]) =>
  z
    .object({
      __component: z.literal("form-elements.exclusive-checkbox"),
      ...Object.fromEntries(checkboxes.map((c) => [c, checkedOptional])),
    })
    .refine(
      ({ __component, ...rest }) => {
        const checkboxValues = Object.entries(rest)
          .filter(([key]) => key !== "none")
          .map(([, value]) => value) as Array<z.infer<typeof checkedOptional>>;
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
          .map(([, value]) => value) as Array<z.infer<typeof checkedOptional>>;
        return (
          ((rest as ExclusiveCheckboxes).none === "on" &&
            checkboxValues.every((v) => v === "off")) ||
          ((rest as ExclusiveCheckboxes).none === "off" &&
            checkboxValues.some((v) => v === "on"))
        );
      },
      { error: "Ungültige Kombination" },
    );
