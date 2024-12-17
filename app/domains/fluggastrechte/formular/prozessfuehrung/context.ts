import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastrechtProzessfuehrungDaten = {
  versaeumnisurteil: YesNoAnswer,
  videoverhandlung: YesNoAnswer,
};

const _contextObject = z.object(fluggastrechtProzessfuehrungDaten).partial();
export type FluggastrechtProzessfuehrungContext = z.infer<
  typeof _contextObject
>;
