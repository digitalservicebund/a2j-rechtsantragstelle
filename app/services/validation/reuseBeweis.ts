import z from "zod";
import { checkedOptional } from "./checkedCheckbox";
import { translations } from "../translations/translations";

export const reuseBeweisZodDescription = "reuseBeweis";

export const reuseBeweisSchema = (beweisType: "document" | "person") =>
  z
    .record(z.string(), checkedOptional)
    .optional()
    .refine((checkboxes) => Object.values(checkboxes ?? {}).includes("on"), {
      message:
        beweisType === "document"
          ? translations.geldEinklagen.reuseBeweisDocumentSelectionRequired.de
          : translations.geldEinklagen.reuseBeweisPersonSelectionRequired.de,
    })
    .meta({
      description: reuseBeweisZodDescription,
      beweisType,
    });
