import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { autoSuggestStringRequiredSchema } from "~/services/validation/autoSuggest";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const verstorbenePersonPages = {
  verstorbeneName: {
    stepId: "/verstorbene/name",
    pageSchema: {
      verstorbeneVorname: stringRequiredSchema,
      verstorbeneNachname: stringRequiredSchema,
      verstorbeneGeburtsname: stringOptionalSchema,
    },
  },
  sterbedatumOrt: {
    stepId: "/verstorbene/sterbedatum-ort",
    pageSchema: {
      sterbedatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
      sterbeort: stringRequiredSchema,
    },
  },
  verstorbeneGeburtsdatumOrt: {
    stepId: "/verstorbene/geburtsdatum-ort",
    pageSchema: {
      verstorbeneGeburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
      verstorbeneGeburtsort: stringRequiredSchema,
    },
  },
  verstorbeneFamilienstand: {
    stepId: "/verstorbene/familienstand",
    pageSchema: {
      verstorbeneFamilienstand: z.enum([
        "ledig",
        "verheiratet",
        "geschieden",
        "verwitwet",
      ]),
    },
  },
  verstorbeneStaatsangehoerigkeit: {
    stepId: "/verstorbene/staatsangehoerigkeit",
    pageSchema: {
      verstorbeneStaatsangehoerigkeit:
        autoSuggestStringRequiredSchema("nationalities"),
    },
  },
  verstorbeneZweiteStaatsangehoerigkeitFrage: {
    stepId: "/verstorbene/zweite-staatsangehoerigkeit-frage",
    pageSchema: {
      verstorbeneHadSecondNationality: YesNoAnswer,
    },
  },
  verstorbeneZweiteStaatsangehoerigkeit: {
    stepId: "/verstorbene/zweite-staatsangehoerigkeit",
    pageSchema: {
      verstorbeneZweiteStaatsangehoerigkeit:
        autoSuggestStringRequiredSchema("nationalities"),
    },
  },
  verstorbeneDritteStaatsangehoerigkeitFrage: {
    stepId: "/verstorbene/dritte-staatsangehoerigkeit-frage",
    pageSchema: {
      verstorbeneHadThirdNationality: YesNoAnswer,
    },
  },
  verstorbeneDritteStaatsangehoerigkeit: {
    stepId: "/verstorbene/dritte-staatsangehoerigkeit",
    pageSchema: {
      verstorbeneDritteStaatsangehoerigkeit:
        autoSuggestStringRequiredSchema("nationalities"),
    },
  },
  verstorbeneLebensmittelpunkt: {
    stepId: "/verstorbene/lebensmittelpunkt",
    pageSchema: {
      verstorbeneLebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
  auslaendischerErbfallInfo: {
    stepId: "/verstorbene/auslaendischer-erbfall-info",
  },
  verstorbenePersonAuslaendischeAdresse: {
    stepId: "/verstorbene/auslaendische-adresse",
    pageSchema: {
      verstorbenePersonAuslaendischeStrasse: stringRequiredSchema,
      verstorbenePersonAuslaendischeHausnummer: stringRequiredSchema,
      verstorbenePersonAuslaendischerOrt: stringRequiredSchema,
      verstorbenePersonLand: stringRequiredSchema,
      verstorbenePersonAuslaendischerAdresszusatz: stringOptionalSchema,
    },
  },
  verstorbenePflegeheimFrage: {
    stepId: "/verstorbene/pflegeheim",
    pageSchema: {
      verstorbeneLivedInPflegeheim: YesNoAnswer,
    },
  },
  verstorbenePflegeheimPlz: {
    stepId: "/verstorbene/pflegeheim-plz",
    pageSchema: {
      verstorbenePflegeheimPlz: postcodeSchema,
    },
  },
  verstorbeneHospizFrage: {
    stepId: "/verstorbene/hospiz",
    pageSchema: {
      verstorbeneLivedInHospiz: YesNoAnswer,
    },
  },
  verstorbeneHospizPlz: {
    stepId: "/verstorbene/hospiz-plz",
    pageSchema: {
      verstorbeneHospizPlz: postcodeSchema,
    },
  },
  verstorbenePlz: {
    stepId: "/verstorbene/plz",
    pageSchema: {
      verstorbenePlz: postcodeSchema,
    },
  },
  verstorbenePersonAdresse: {
    stepId: "/verstorbene/adresse",
    pageSchema: {
      verstorbenePersonStrasse: stringRequiredSchema,
      verstorbenePersonHausnummer: stringRequiredSchema,
      verstorbenePersonOrt: stringRequiredSchema,
      verstorbenePersonAdresszusatz: stringOptionalSchema,
    },
  },
} satisfies PagesConfig;
