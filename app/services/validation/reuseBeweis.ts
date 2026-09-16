import { stringRequiredSchema } from "./stringRequired";

export const reuseBeweisZodDescription = "reuseBeweis";

export const reuseBeweisSchema = (beweisType: "document" | "person") =>
  stringRequiredSchema.meta({
    description: reuseBeweisZodDescription,
    beweisType,
  });
