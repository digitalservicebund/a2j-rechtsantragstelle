import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { bookingNumberFlightSchema } from "~/services/validation/bookingNumberFlight";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { ibanSchema } from "~/services/validation/iban";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const persoenlicheDatenSchema = {
  anrede: z.enum(["herr", "frau", "none"]),
  title: z.enum(["", "dr"]),
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
  telefonnummer: schemaOrEmptyString(phoneNumberSchema),
  iban: schemaOrEmptyString(ibanSchema),
  kontoinhaber: stringOptionalSchema,
};

const weiterePersonenArraySchema = z.array(
  z
    .object({
      buchungsnummer: schemaOrEmptyString(bookingNumberFlightSchema),
      ...persoenlicheDatenSchema,
      datenverarbeitungZustimmung: checkedRequired,
    })
    .partial(),
);

export const fluggastrechtePersoenlicheDatenPages = {
  personDaten: {
    stepId: "persoenliche-daten/person/daten",
    pageSchema: {
      ...persoenlicheDatenSchema,
    },
  },
  weiterePersonenFrage: {
    stepId: "persoenliche-daten/weitere-personen/frage",
    pageSchema: {
      isWeiterePersonen: YesNoAnswer,
    },
  },
  weiterePersonenUebersicht: {
    stepId: "persoenliche-daten/weitere-personen/uebersicht",
  },
  weiterePersonenDaten: {
    stepId: "persoenliche-daten/weitere-personen/person",
    pageSchema: {
      weiterePersonen: weiterePersonenArraySchema,
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "weiterePersonen#buchungsnummer":
            weiterePersonenArraySchema.element.shape.buchungsnummer,
          "weiterePersonen#anrede":
            weiterePersonenArraySchema.element.shape.anrede,
          "weiterePersonen#title":
            weiterePersonenArraySchema.element.shape.title,
          "weiterePersonen#vorname":
            weiterePersonenArraySchema.element.shape.vorname,
          "weiterePersonen#nachname":
            weiterePersonenArraySchema.element.shape.nachname,
          "weiterePersonen#strasseHausnummer":
            weiterePersonenArraySchema.element.shape.strasseHausnummer,
          "weiterePersonen#plz": weiterePersonenArraySchema.element.shape.plz,
          "weiterePersonen#ort": weiterePersonenArraySchema.element.shape.ort,
          "weiterePersonen#land": weiterePersonenArraySchema.element.shape.land,
          "weiterePersonen#telefonnummer":
            weiterePersonenArraySchema.element.shape.telefonnummer,
          "weiterePersonen#datenverarbeitungZustimmung":
            weiterePersonenArraySchema.element.shape
              .datenverarbeitungZustimmung,
        },
      },
    },
  },
  weiterePersonenWarnung: {
    stepId: "persoenliche-daten/weitere-personen/warnung",
  },
} satisfies PagesConfig;
