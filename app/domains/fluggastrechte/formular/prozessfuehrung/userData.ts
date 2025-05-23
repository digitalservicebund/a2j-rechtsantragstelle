import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const fluggastrechteProzessfuehrungInputSchema = {
  hasZeugen: YesNoAnswer,
  versaeumnisurteil: YesNoAnswer,
  videoverhandlung: z.enum(
    ["yes", "no", "noSpecification"],
    customRequiredErrorMessage,
  ),
};

const _partialSchema = z
  .object(fluggastrechteProzessfuehrungInputSchema)
  .partial();
export type FluggastrechteProzessfuehrungContext = z.infer<
  typeof _partialSchema
>;
