import { z } from "zod";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastrechtForderungDaten = {
  teilentschaedigung: YesNoAnswer,
  nebenforderungen: z.object({
    verzugszinsen: checkedOptional,
    prozesszinsen: checkedOptional,
  }),
};

const _contextObject = z.object(fluggastrechtForderungDaten).partial();
export type FluggastrechtForderungContext = z.infer<typeof _contextObject>;
