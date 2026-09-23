import z from "zod";
import { isTotalClaimWillSucceddedAboveLimit } from "~/domains/fluggastrechte/formular/services/isTotalClaimAboveLimit";
import { WEITERE_PERSONEN_START_INDEX } from "~/domains/fluggastrechte/formular/stringReplacements/person";
import type { PagesConfig } from "~/domains/pageSchemas";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { ibanSchema } from "~/services/validation/iban";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const persoenlicheDatenSchema = {
  anrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
  title: schemaOrEmptyString(z.enum(["none", "dr"])),
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  strasse: stringRequiredSchema,
  hausnummer: stringRequiredSchema,
  plz: stringRequiredSchema,
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
  telefonnummer: schemaOrEmptyString(phoneNumberSchema),
};

export const weiterePersonenArraySchema = z.array(
  z.object({
    buchungsnummer: schemaOrEmptyString(stringRequiredSchema),
    ...persoenlicheDatenSchema,
    datenverarbeitungZustimmung: checkedRequired,
  }),
);

export type FluggastrechteFormularWeiterePersonen = z.infer<
  typeof weiterePersonenArraySchema
>;

export const fluggastrechtePersoenlicheDatenPages = {
  personDaten: {
    stepId: "persoenliche-daten/person/daten",
    pageSchema: {
      ...persoenlicheDatenSchema,
      iban: schemaOrEmptyString(ibanSchema),
      kontoinhaber: stringOptionalSchema,
    },
  },
  weiterePersonenFrage: {
    stepId: "persoenliche-daten/weitere-personen/frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      isWeiterePersonen: YesNoAnswer,
    },
  },
  weiterePersonenUebersicht: {
    stepId: "persoenliche-daten/weitere-personen/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "weiterePersonen",
      schema: weiterePersonenArraySchema,
      isArrayRelevant: (context) => context.isWeiterePersonen === "yes",
      hiddenFields: ["anrede", "title", "datenverarbeitungZustimmung"],
      indexOffset: WEITERE_PERSONEN_START_INDEX,
      shouldDisableAddButton: isTotalClaimWillSucceddedAboveLimit,
    },
  },
  weiterePersonenDaten: {
    stepId: "persoenliche-daten/weitere-personen/person/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "weiterePersonen#buchungsnummer":
        weiterePersonenArraySchema.element.shape.buchungsnummer,
      "weiterePersonen#anrede": weiterePersonenArraySchema.element.shape.anrede,
      "weiterePersonen#title": weiterePersonenArraySchema.element.shape.title,
      "weiterePersonen#vorname":
        weiterePersonenArraySchema.element.shape.vorname,
      "weiterePersonen#nachname":
        weiterePersonenArraySchema.element.shape.nachname,
      "weiterePersonen#strasse":
        weiterePersonenArraySchema.element.shape.strasse,
      "weiterePersonen#hausnummer":
        weiterePersonenArraySchema.element.shape.hausnummer,
      "weiterePersonen#plz": weiterePersonenArraySchema.element.shape.plz,
      "weiterePersonen#ort": weiterePersonenArraySchema.element.shape.ort,
      "weiterePersonen#land": weiterePersonenArraySchema.element.shape.land,
      "weiterePersonen#telefonnummer":
        weiterePersonenArraySchema.element.shape.telefonnummer,
      "weiterePersonen#datenverarbeitungZustimmung":
        weiterePersonenArraySchema.element.shape.datenverarbeitungZustimmung,
    },
  },
  weiterePersonenWarnung: {
    stepId: "persoenliche-daten/weitere-personen/warnung",
  },
} as const satisfies PagesConfig;
