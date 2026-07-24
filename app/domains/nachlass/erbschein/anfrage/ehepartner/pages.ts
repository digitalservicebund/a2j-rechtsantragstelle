import { type PagesConfig } from "~/domains/pageSchemas";
import { autoSuggestStringRequiredSchema } from "~/services/validation/autoSuggest";
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
  ehepartnerAnschrift: {
    stepId: "/ehepartner-oder-ehepartnerin/anschrift",
    pageSchema: {
      ehepartnerStrasse: stringRequiredSchema,
      ehepartnerHausnummer: stringRequiredSchema,
      ehepartnerAdresszusatz: stringOptionalSchema,
      ehepartnerPlz: stringRequiredSchema,
      ehepartnerOrt: stringRequiredSchema,
    },
  },
  ehepartnerStaatsangehoerigkeit: {
    stepId: "/ehepartner-oder-ehepartnerin/staatsangehoerigkeit",
    pageSchema: {
      ehepartnerStaatsangehoerigkeit:
        autoSuggestStringRequiredSchema("nationalities"),
    },
  },
  ehepartnerZweiteStaatsangehoerigkeitFrage: {
    stepId: "/ehepartner-oder-ehepartnerin/zweite-staatsangehoerigkeit-frage",
    pageSchema: {
      ehepartnerHadSecondNationality: YesNoAnswer,
    },
  },
  ehepartnerZweiteStaatsangehoerigkeit: {
    stepId: "/ehepartner-oder-ehepartnerin/zweite-staatsangehoerigkeit",
    pageSchema: {
      ehepartnerZweiteStaatsangehoerigkeit:
        autoSuggestStringRequiredSchema("nationalities"),
    },
  },
  ehevertrag: {
    stepId: "/ehepartner-oder-ehepartnerin/ehevertrag",
    pageSchema: {
      hasEhevertrag: YesNoAnswer,
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
