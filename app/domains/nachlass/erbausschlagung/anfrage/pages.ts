import { z } from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const nachlassErbausschlagungAnfragePages = {
  start: {
    stepId: "start/start",
  },
  datenverarbeitung: {
    stepId: "start/datenverarbeitung",
    pageSchema: {
      datenverarbeitungZustimmung: checkedRequired,
    },
  },
  verstorbeneName: {
    stepId: "verstorbene/name",
    pageSchema: {
      verstorbeneVorname: stringRequiredSchema,
      verstorbeneNachname: stringRequiredSchema,
      verstorbeneGeburtsname: stringOptionalSchema,
    },
  },
  verstorbeneGeburtsdatum: {
    stepId: "verstorbene/geburtsdatum",
    pageSchema: {
      verstorbeneGeburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  verstorbeneSterbedatum: {
    stepId: "verstorbene/sterbedatum",
    pageSchema: {
      verstorbeneSterbedatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  verstorbeneLebensmittelpunkt: {
    stepId: "verstorbene/lebensmittelpunkt",
    pageSchema: {
      verstorbeneLebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
  pflegeheim: {
    stepId: "verstorbene/pflegeheim",
    pageSchema: {
      livedInNursingHome: YesNoAnswer,
    },
  },
  hospiz: {
    stepId: "verstorbene/hospiz",
    pageSchema: {
      livedInHospice: YesNoAnswer,
    },
  },
  plzBeforeHospiz: {
    stepId: "verstorbene/plz-vor-hospiz",
    pageSchema: {
      plzBeforeHospiz: postcodeSchema,
    },
  },
  pflegeheimPLZ: {
    stepId: "verstorbene/pflegeheim-plz",
    pageSchema: {
      pflegeheimPLZ: postcodeSchema,
    },
  },
  verstorbenePlz: {
    stepId: "verstorbene/plz",
    pageSchema: {
      verstorbenePLZ: postcodeSchema,
    },
  },
  verstorbeneAdresse: {
    stepId: "verstorbene/adresse",
    pageSchema: {
      verstorbeneAdresseStrasse: stringRequiredSchema,
      verstorbeneAdresseHausnummer: germanHouseNumberSchema,
      verstorbeneAdresseOrt: stringRequiredSchema,
      verstorbeneAdresseZusatz: stringOptionalSchema,
    },
  },
  verstorbeneAuslaendischeAdresse: {
    stepId: "verstorbene/auslaendische-adresse",
    pageSchema: {
      verstorbeneAuslaendischeAdresseStrasse: stringRequiredSchema,
      verstorbeneAuslaendischeAdresseHausnummer: germanHouseNumberSchema,
      verstorbeneAuslaendischeAdressePLZ: postcodeSchema,
      verstorbeneAuslaendischeAdresseOrt: stringRequiredSchema,
      verstorbeneAuslaendischeAdresseZusatz: stringOptionalSchema,
      verstorbeneAuslaendischeAdresseLand: stringRequiredSchema,
    },
  },
  testament: {
    stepId: "verstorbene/testament",
    pageSchema: {
      testament: z.enum([
        "none",
        "handwritten",
        "notarized",
        "erbvertrag",
        "unknown",
      ]),
    },
  },
  namedInTestament: {
    stepId: "verstorbene/im-testament-genannt",
    pageSchema: {
      namedInTestament: YesNoAnswer,
    },
  },
  letterReceivedFromNachlassgericht: {
    stepId: "verstorbene/brief-vom-nachlassgericht",
    pageSchema: {
      letterReceivedFromNachlassgericht: YesNoAnswer,
    },
  },
  letterReceivedFromCourt: {
    stepId: "verstorbene/brief-vom-gericht",
    pageSchema: {
      dateOfReceipt: createSplitDateSchema({
        earliest: () => addYears(today(), -1),
        latest: () => today(),
      }),
      weitereAngaben: stringOptionalSchema,
    },
  },
  awarenessDate: {
    stepId: "verstorbene/kenntnisdatum",
    pageSchema: {
      awarenessDate: createSplitDateSchema({
        earliest: () => addYears(today(), -1),
        latest: () => today(),
      }),
    },
  },
  ausschlagungNotNecessary: {
    stepId: "verstorbene/ausschlagung-nicht-notwendig",
  },
  ausschlagendePersonName: {
    stepId: "ausschlagende-person/name",
    pageSchema: {
      ausschlagendePersonVorname: stringRequiredSchema,
      ausschlagendePersonNachname: stringRequiredSchema,
      ausschlagendePersonGeburtsname: stringOptionalSchema,
    },
  },
} as const satisfies PagesConfig;
