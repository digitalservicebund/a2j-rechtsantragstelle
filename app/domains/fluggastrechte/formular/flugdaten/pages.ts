import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { airportSchema } from "~/services/validation/airport";
import { autoSuggestSchema } from "~/services/validation/autoSuggest";
import { createDateSchema } from "~/services/validation/dateString";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { createSplitTimeSchema } from "~/services/validation/timeObject";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const fourYearsAgoSchema = createDateSchema({
  earliest: () => addYears(today(), -4),
  latest: () => today(),
});

export const fluggastrechteFlugdatenPages = {
  flugdatenAdresseFluggesellschaftAuswahl: {
    stepId: "flugdaten/adresse-fluggesellschaft-auswahl",
    pageSchema: {
      fluggesellschaftAuswahlAdresse: z.enum(["fromAirlineDB", "filledByUser"]),
    },
  },
  flugdatenAdresseFluggesellschaft: {
    stepId: "flugdaten/adresse-fluggesellschaft",
    pageSchema: {
      fluggesellschaft: autoSuggestSchema(stringOptionalSchema)("airlines"),
      fluggesellschaftStrasse: stringRequiredSchema,
      fluggesellschaftHausnummer: stringRequiredSchema,
      fluggesellschaftPostleitzahl: stringRequiredSchema,
      fluggesellschaftOrt: stringRequiredSchema,
      fluggesellschaftLand: stringRequiredSchema,
    },
  },
  flugdatenGeplanterFlug: {
    stepId: "flugdaten/geplanter-flug",
    pageSchema: {
      direktFlugnummer: stringRequiredSchema,
      buchungsNummer: stringRequiredSchema,
      direktAbflugsDatum: fourYearsAgoSchema,
      direktAbflugsZeit: createSplitTimeSchema(),
      zwischenstoppAnzahl: z.enum(["no", "oneStop", "twoStop", "threeStop"]),
      direktAnkunftsDatum: fourYearsAgoSchema,
      direktAnkunftsZeit: createSplitTimeSchema(),
    },
  },
  flugdatenZwischenstoppUebersicht1: {
    stepId: "flugdaten/zwischenstopp-uebersicht-1",
    pageSchema: {
      ersterZwischenstopp: autoSuggestSchema(airportSchema.optional())(
        "airports",
      ),
      startAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
      endAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
    },
  },
  flugdatenZwischenstoppUebersicht2: {
    stepId: "flugdaten/zwischenstopp-uebersicht-2",
    pageSchema: {
      ersterZwischenstopp: autoSuggestSchema(airportSchema.optional())(
        "airports",
      ),
      zweiterZwischenstopp: autoSuggestSchema(airportSchema.optional())(
        "airports",
      ),
      startAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
      endAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
    },
  },
  flugdatenZwischenstoppUebersicht3: {
    stepId: "flugdaten/zwischenstopp-uebersicht-3",
    pageSchema: {
      ersterZwischenstopp: autoSuggestSchema(airportSchema.optional())(
        "airports",
      ),
      zweiterZwischenstopp: autoSuggestSchema(airportSchema.optional())(
        "airports",
      ),
      dritterZwischenstopp: autoSuggestSchema(airportSchema.optional())(
        "airports",
      ),
      startAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
      endAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
    },
  },
  flugdatenVerspaeteterFlug1: {
    stepId: "flugdaten/verspaeteter-flug-1",
    pageSchema: {
      verspaeteterFlugOneStop: z.enum([
        "startAirportFirstZwischenstopp",
        "firstZwischenstoppEndAirport",
      ]),
    },
  },
  flugdatenVerspaeteterFlug2: {
    stepId: "flugdaten/verspaeteter-flug-2",
    pageSchema: {
      verspaeteterFlugTwoStops: z.enum([
        "startAirportFirstZwischenstopp",
        "firstAirportSecondZwischenstopp",
        "secondZwischenstoppEndAirport",
      ]),
    },
  },
  flugdatenVerspaeteterFlug3: {
    stepId: "flugdaten/verspaeteter-flug-3",
    pageSchema: {
      verspaeteterFlugThreeStops: z.enum([
        "startAirportFirstZwischenstopp",
        "firstAirportSecondZwischenstopp",
        "secondAirportThirdZwischenstopp",
        "thirdZwischenstoppEndAirport",
      ]),
    },
  },
  flugdatenAnschlussFlugVerpasst: {
    stepId: "flugdaten/anschluss-flug-verpasst",
    pageSchema: {
      anschlussFlugVerpasst: YesNoAnswer,
      ersatzflug: hiddenInputSchema(schemaOrEmptyString(stringOptionalSchema)),
    },
  },
  flugdatenTatsaechlicherFlug: {
    stepId: "flugdaten/tatsaechlicher-flug",
    pageSchema: {
      tatsaechlicherFlug: YesNoAnswer,
    },
  },
  flugdatenTatsaechlicherFlugAnkunft: {
    stepId: "flugdaten/tatsaechlicher-flug-ankunft",
    pageSchema: {
      tatsaechlicherAnkunftsDatum: fourYearsAgoSchema,
      tatsaechlicherAnkunftsZeit: createSplitTimeSchema(),
      direktAnkunftsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAnkunftsZeit: hiddenInputSchema(createSplitTimeSchema()),
    },
  },
  flugdatenErsatzverbindungDaten: {
    stepId: "flugdaten/ersatzverbindung-daten",
    pageSchema: {
      annullierungErsatzverbindungFlugnummer:
        schemaOrEmptyString(stringOptionalSchema),
      annullierungErsatzverbindungAbflugsDatum:
        schemaOrEmptyString(fourYearsAgoSchema),
      annullierungErsatzverbindungAbflugsZeit: schemaOrEmptyString(
        createSplitTimeSchema(),
      ),
      annullierungErsatzverbindungAnkunftsDatum:
        schemaOrEmptyString(fourYearsAgoSchema),
      annullierungErsatzverbindungAnkunftsZeit: schemaOrEmptyString(
        createSplitTimeSchema(),
      ),
      direktAbflugsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAbflugsZeit: hiddenInputSchema(createSplitTimeSchema()),
      direktAnkunftsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAnkunftsZeit: hiddenInputSchema(createSplitTimeSchema()),
      ersatzflugStartenEinStunde: hiddenInputSchema(stringOptionalSchema),
      ersatzflugLandenZweiStunden: hiddenInputSchema(stringOptionalSchema),
      ersatzflugStartenZweiStunden: hiddenInputSchema(stringOptionalSchema),
      ersatzflugLandenVierStunden: hiddenInputSchema(stringOptionalSchema),
      ankuendigung: hiddenInputSchema(
        schemaOrEmptyString(
          z.enum(["no", "until6Days", "between7And13Days", "moreThan13Days"]),
        ),
      ),
    },
  },
  flugdatenErsatzverbindungArt: {
    stepId: "flugdaten/ersatzverbindung-art",
    pageSchema: {
      ersatzverbindungArt: z.enum(["flug", "etwasAnderes", "keineAnkunft"]),
    },
  },
  flugdatenAndererFlugAnkunft: {
    stepId: "flugdaten/anderer-flug-ankunft",
    pageSchema: {
      ersatzFlugnummer: stringRequiredSchema,
      ersatzFlugAnkunftsDatum: fourYearsAgoSchema,
      ersatzFlugAnkunftsZeit: createSplitTimeSchema(),
      bereich: hiddenInputSchema(stringOptionalSchema),
      direktAnkunftsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAnkunftsZeit: hiddenInputSchema(createSplitTimeSchema()),
    },
  },
  flugdatenErsatzverbindungBeschreibung: {
    stepId: "flugdaten/ersatzverbindung-beschreibung",
    pageSchema: {
      andereErsatzverbindungBeschreibung: stringOptionalSchema,
      andereErsatzverbindungAnkunftsDatum: fourYearsAgoSchema,
      andereErsatzverbindungAnkunftsZeit: createSplitTimeSchema(),
      bereich: hiddenInputSchema(stringOptionalSchema),
      direktAnkunftsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAnkunftsZeit: hiddenInputSchema(createSplitTimeSchema()),
    },
  },
  flugdatenZusaetzlicheAngaben: {
    stepId: "flugdaten/zusaetzliche-angaben",
    pageSchema: {
      zusaetzlicheAngaben: schemaOrEmptyString(stringRequiredSchema),
    },
  },
} satisfies PagesConfig;
