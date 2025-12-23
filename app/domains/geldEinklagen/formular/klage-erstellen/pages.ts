import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { ibanSchema } from "~/services/validation/iban";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

const sharedBeklagteAddress = {
  beklagteStrasseHausnummer: stringRequiredSchema,
  beklagtePlz: stringRequiredSchema.pipe(postcodeSchema),
  beklagteOrt: stringRequiredSchema,
};

export const geldEinklagenKlageErstellenPages = {
  klageErstellenIntroStart: {
    stepId: "klage-erstellen/intro/start",
  },
  streitWertKostenGerichtskostenvorschuss: {
    stepId: "klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
  },
  streitwertKostenWeitereKosten: {
    stepId: "klage-erstellen/streitwert-kosten/weitere-kosten",
  },
  klagendePersonKontaktdaten: {
    stepId: "klage-erstellen/klagende-person/kontaktdaten",
    pageSchema: {
      klagendePersonAnrede: z.enum(["herr", "frau", "none"]),
      klagendePersonTitle: z.enum(["", "dr"]),
      klagendePersonVorname: stringRequiredSchema,
      klagendePersonNachname: stringRequiredSchema,
      klagendePersonStrasseHausnummer: stringRequiredSchema,
      klagendePersonPlz: stringRequiredSchema.pipe(postcodeSchema),
      klagendePersonOrt: stringRequiredSchema,
      klagendeTelefonnummer: schemaOrEmptyString(phoneNumberSchema),
      klagendePersonIban: schemaOrEmptyString(ibanSchema),
      klagendePersonKontoinhaber: stringOptionalSchema,
    },
  },
  beklagtePersonMenschen: {
    stepId: "klage-erstellen/beklagte-person/mensch",
    pageSchema: {
      gegenWenBeklagen: hiddenInputSchema(z.enum(["person", "organisation"])),
      beklagteAnrede: z.enum(["herr", "frau", "none"]),
      beklagteTitle: z.enum(["", "dr"]),
      beklagteVorname: stringRequiredSchema,
      beklagteNachname: stringRequiredSchema,
      ...sharedBeklagteAddress,
    },
  },
  beklagtePersonOrganisation: {
    stepId: "klage-erstellen/beklagte-person/organisation",
    pageSchema: {
      gegenWenBeklagen: hiddenInputSchema(z.enum(["person", "organisation"])),
      beklagteNameOrganisation: stringRequiredSchema,
      beklagteGesetzlichenVertretung: stringRequiredSchema,
      ...sharedBeklagteAddress,
    },
  },
  rechtsproblemIntoStart: {
    stepId: "klage-erstellen/rechtsproblem/intro/start",
  },
} as const satisfies PagesConfig;
