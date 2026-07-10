import { type PagesConfig } from "~/domains/pageSchemas";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const nachlassErbscheinAnfragePages = {
  start: {
    stepId: "/start",
  },
  datenverarbeitung: {
    stepId: "/start/datenverarbeitung",
    pageSchema: {
      datenverarbeitungZustimmung: checkedRequired,
    },
  },
  verstorbeneName: {
    stepId: "/verstorbene/name",
    pageSchema: {
      verstorbeneVorname: stringRequiredSchema,
      verstorbeneNachname: stringRequiredSchema,
      verstorbeneGeburtsname: stringOptionalSchema,
    },
  },
} satisfies PagesConfig;
