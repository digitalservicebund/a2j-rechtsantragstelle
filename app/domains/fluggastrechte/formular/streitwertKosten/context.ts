import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastrechteStreitKostenDaten = {
  prozesszinsen: YesNoAnswer,
};

const _contextObject = z.object(fluggastrechteStreitKostenDaten).partial();
