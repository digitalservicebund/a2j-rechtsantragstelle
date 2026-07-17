import { type PagesConfig } from "~/domains/pageSchemas";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const ehepartnerPages = {
  spouseName: {
    stepId: "/ehepartner-oder-ehepartnerin/name",
    pageSchema: {
      ehepartnerVorname: stringRequiredSchema,
      ehepartnerNachname: stringRequiredSchema,
      ehepartnerGeburtsname: stringOptionalSchema,
    },
  },
  spouseHasDifferentAddress: {
    stepId: "/ehepartner-oder-ehepartnerin/andere-adresse",
    pageSchema: {
      spouseHasDifferentAddress: YesNoAnswer,
    },
  },
  spouseSterbedatumOrt: {
    stepId: "/ehepartner-oder-ehepartnerin/sterbedatum-ort",
    pageSchema: {
      spouseSterbedatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
      spouseSterbeort: stringRequiredSchema,
    },
  },
} satisfies PagesConfig;
