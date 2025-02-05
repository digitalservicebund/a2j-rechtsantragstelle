import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastrechteProzessfuehrungDaten = {
  versaeumnisurteil: YesNoAnswer,
  videoverhandlung: YesNoAnswer,
};

const _contextObject = z.object(fluggastrechteProzessfuehrungDaten).partial();
export type FluggastrechteProzessfuehrungContext = z.infer<
  typeof _contextObject
>;
