import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
export const fluggastrechteProzessfuehrungPages = {
  prozessfuehrungZeugen: {
    stepId: "prozessfuehrung/zeugen",
    pageSchema: {
      hasZeugen: YesNoAnswer,
    },
  },
  prozessfuehrungVideoverhandlung: {
    stepId: "prozessfuehrung/videoverhandlung",
    pageSchema: {
      videoverhandlung: z.enum(["yes", "no", "noSpecification"]),
    },
  },
  prozessfuehrungVersaeumnisurteil: {
    stepId: "prozessfuehrung/versaeumnisurteil",
    pageSchema: {
      versaeumnisurteil: YesNoAnswer,
    },
  },
} satisfies PagesConfig;
