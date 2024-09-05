import { z } from "zod";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastrechtStreitKostenDaten = {
  versaeumnisurteil: YesNoAnswer,
  prozesszinsen: YesNoAnswer,
  aenderungMitteilung: checkedRequired,
};

const _contextObject = z.object(fluggastrechtStreitKostenDaten).partial();
export type FluggastrechtStreitKostenContext = z.infer<typeof _contextObject>;
