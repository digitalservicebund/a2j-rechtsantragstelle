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
      ...Object.fromEntries(checkboxes.map((c) => [c, checkedOptional])),
      specialField: checkedOptional,
    })
    .refine(
      ({ specialField, ...rest }) => {
        return (
          (specialField === "on" &&
            Object.values(rest).every((v) => v === "off")) ||
          (specialField === "off" &&
            Object.values(rest).some((v) => v === "on"))
        );
      },
      { error: "Ungültige Kombination" },
    )
    .brand("exclusiveCheckboxes");
