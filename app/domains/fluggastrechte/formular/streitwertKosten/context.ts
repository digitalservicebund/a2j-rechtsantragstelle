import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastrechtStreitKostenDaten = {
  prozesszinsen: YesNoAnswer,
};

const _contextObject = z.object(fluggastrechtStreitKostenDaten).partial();
export type FluggastrechtStreitKostenContext = z.infer<typeof _contextObject>;
