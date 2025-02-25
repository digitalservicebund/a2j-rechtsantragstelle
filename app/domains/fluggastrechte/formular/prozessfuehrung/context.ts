import { z } from "zod";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const fluggastrechteProzessfuehrungDaten = {
  hasZeugen: YesNoAnswer,
  versaeumnisurteil: YesNoAnswer,
  videoverhandlung: z.enum(
    ["yes", "no", "noSpecification"],
    customRequiredErrorMessage,
  ),
};

const _contextObject = z.object(fluggastrechteProzessfuehrungDaten).partial();
export type FluggastrechteProzessfuehrungContext = z.infer<
  typeof _contextObject
>;
