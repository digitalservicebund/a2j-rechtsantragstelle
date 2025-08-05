import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const checkedRequired = z.enum(["on"], customRequiredErrorMessage);

export const checkedOptional = z.enum(
  ["on", "off"],
  customRequiredErrorMessage,
);

export const exclusiveCheckboxesSchema = (checkboxes: string[]) =>
  z
    .object({
      none: checkedOptional,
      __component: z.literal("form-elements.exclusive-checkbox"),
      ...Object.fromEntries(checkboxes.map((c) => [c, checkedOptional])),
    })
    .refine(
      ({ none, __component, ...rest }) => {
        return none === "on" || Object.values(rest).some((v) => v === "on");
      },
      { error: "Bitte treffen Sie eine Auswahl" },
    )
    .refine(
      ({ none, __component, ...rest }) => {
        return (
          (none === "on" && Object.values(rest).every((v) => v === "off")) ||
          (none === "off" && Object.values(rest).some((v) => v === "on"))
        );
      },
      { error: "Ungültige Kombination" },
    );
