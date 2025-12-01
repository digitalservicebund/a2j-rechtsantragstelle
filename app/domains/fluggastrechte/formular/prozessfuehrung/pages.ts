import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
export const fluggastrechteProzessfuehrungPages = {
  prozessfuehrung: {
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
  prozzessfuehrungVersaeumnisurteil: {
    stepId: "prozessfuehrung/versaeumnisurteil",
    pageSchema: {
      versaeumnisurteil: YesNoAnswer,
    },
  },
} satisfies PagesConfig;
