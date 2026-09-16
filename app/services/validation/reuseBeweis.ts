import z from "zod";
import { checkedOptional } from "./checkedCheckbox";

export const reuseBeweisZodDescription = "reuseBeweis";

export const reuseBeweisSchema = (beweisType: "document" | "person") =>
  z
    .record(z.string(), checkedOptional)
    .optional()
    .refine(
      (checkboxes) =>
        Object.values(checkboxes ?? {}).some((value) => value === "on"),
      { message: "selection_required" },
    )
    .meta({
      description: reuseBeweisZodDescription,
      beweisType,
    });
