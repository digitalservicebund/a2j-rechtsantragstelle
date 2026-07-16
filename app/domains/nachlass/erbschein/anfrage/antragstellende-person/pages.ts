import { type PagesConfig } from "~/domains/pageSchemas";
import { autoSuggestSchema } from "~/services/validation/autoSuggest";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { emailSchema } from "~/services/validation/email";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const antragstellendePersonPages = {
  antragstellendePersonName: {
    stepId: "/antragstellende-person/name",
    pageSchema: {
      antragstellendePersonVorname: stringRequiredSchema,
      antragstellendePersonNachname: stringRequiredSchema,
      antragstellendePersonGeburtsname: stringOptionalSchema,
    },
  },
  antragstellendePersonGeburtsdatumOrt: {
    stepId: "/antragstellende-person/geburtsdatum-ort",
    pageSchema: {
      antragstellendePersonGeburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
      antragstellendePersonGeburtsort: stringRequiredSchema,
    },
  },
  antragstellendePersonStaatsangehoerigkeit: {
    stepId: "/antragstellende-person/staatsangehoerigkeit",
    pageSchema: {
      antragstellendePersonStaatsangehoerigkeit:
        autoSuggestSchema("nationalities"),
    },
  },
  antragstellendePersonZweiteStaatsangehoerigkeitFrage: {
    stepId: "/antragstellende-person/zweite-staatsangehoerigkeit-frage",
    pageSchema: {
      antragstellendePersonHasSecondNationality: YesNoAnswer,
    },
  },
  antragstellendePersonZweiteStaatsangehoerigkeit: {
    stepId: "/antragstellende-person/zweite-staatsangehoerigkeit",
    pageSchema: {
      antragstellendePersonZweiteStaatsangehoerigkeit:
        autoSuggestSchema("nationalities"),
    },
  },
  antragstellendePersonDritteStaatsangehoerigkeitFrage: {
    stepId: "/antragstellende-person/dritte-staatsangehoerigkeit-frage",
    pageSchema: {
      antragstellendePersonHasThirdNationality: YesNoAnswer,
    },
  },
  antragstellendePersonDritteStaatsangehoerigkeit: {
    stepId: "/antragstellende-person/dritte-staatsangehoerigkeit",
    pageSchema: {
      antragstellendePersonDritteStaatsangehoerigkeit:
        autoSuggestSchema("nationalities"),
    },
  },
  antragstellendePersonAnschrift: {
    stepId: "/antragstellende-person/anschrift",
    pageSchema: {
      antragstellendePersonStrasse: stringRequiredSchema,
      antragstellendePersonHausnummer: stringRequiredSchema,
      antragstellendePersonOrt: stringRequiredSchema,
      antragstellendePersonLand: stringOptionalSchema,
      antragstellendePersonAdresszusatz: stringOptionalSchema,
    },
  },
  antragstellendePersonKontaktdaten: {
    stepId: "/antragstellende-person/kontaktdaten",
    pageSchema: {
      antragstellendePersonTelefonnummer: phoneNumberSchema,
      antragstellendePersonEmail: schemaOrEmptyString(emailSchema),
    },
  },
} satisfies PagesConfig;
