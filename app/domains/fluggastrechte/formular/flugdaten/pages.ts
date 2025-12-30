import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { airportSchema } from "~/services/validation/airport";
import { bookingNumberFlightSchema } from "~/services/validation/bookingNumberFlight";
import { createDateSchema } from "~/services/validation/date";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { timeSchema } from "~/services/validation/time";
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
      fluggesellschaft: schemaOrEmptyString(z.string()),
      fluggesellschaftStrasseHausnummer: stringRequiredSchema,
      fluggesellschaftPostleitzahl: stringRequiredSchema,
      fluggesellschaftOrt: stringRequiredSchema,
      fluggesellschaftLand: stringRequiredSchema,
    },
  },
  flugdatenGeplanterFlug: {
    stepId: "flugdaten/geplanter-flug",
    pageSchema: {
      direktFlugnummer: stringRequiredSchema,
      buchungsNummer: bookingNumberFlightSchema,
      direktAbflugsDatum: fourYearsAgoSchema,
      direktAbflugsZeit: timeSchema,
      zwischenstoppAnzahl: z.enum(["no", "oneStop", "twoStop", "threeStop"]),
      direktAnkunftsDatum: fourYearsAgoSchema,
      direktAnkunftsZeit: timeSchema,
    },
  },
  flugdatenZwischenstoppUebersicht1: {
    stepId: "flugdaten/zwischenstopp-uebersicht-1",
    pageSchema: {
      ersterZwischenstopp: airportSchema.optional(),
      startAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
      endAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
    },
  },
  flugdatenZwischenstoppUebersicht2: {
    stepId: "flugdaten/zwischenstopp-uebersicht-2",
    pageSchema: {
      ersterZwischenstopp: airportSchema.optional(),
      zweiterZwischenstopp: airportSchema.optional(),
      startAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
      endAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
    },
  },
  flugdatenZwischenstoppUebersicht3: {
    stepId: "flugdaten/zwischenstopp-uebersicht-3",
    pageSchema: {
      ersterZwischenstopp: airportSchema.optional(),
      zweiterZwischenstopp: airportSchema.optional(),
      dritterZwischenstopp: airportSchema.optional(),
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
      tatsaechlicherAnkunftsZeit: timeSchema,
      direktAnkunftsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAnkunftsZeit: hiddenInputSchema(timeSchema),
    },
  },
  flugdatenErsatzverbindungDaten: {
    stepId: "flugdaten/ersatzverbindung-daten",
    pageSchema: {
      annullierungErsatzverbindungFlugnummer:
        schemaOrEmptyString(stringOptionalSchema),
      annullierungErsatzverbindungAbflugsDatum:
        schemaOrEmptyString(fourYearsAgoSchema),
      annullierungErsatzverbindungAbflugsZeit: schemaOrEmptyString(timeSchema),
      annullierungErsatzverbindungAnkunftsDatum:
        schemaOrEmptyString(fourYearsAgoSchema),
      annullierungErsatzverbindungAnkunftsZeit: schemaOrEmptyString(timeSchema),
      direktAbflugsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAbflugsZeit: hiddenInputSchema(timeSchema),
      direktAnkunftsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAnkunftsZeit: hiddenInputSchema(timeSchema),
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
      ersatzFlugAnkunftsZeit: timeSchema,
      bereich: hiddenInputSchema(stringOptionalSchema),
      direktAnkunftsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAnkunftsZeit: hiddenInputSchema(timeSchema),
    },
  },
  flugdatenErsatzverbindungBeschreibung: {
    stepId: "flugdaten/ersatzverbindung-beschreibung",
    pageSchema: {
      andereErsatzverbindungBeschreibung: stringOptionalSchema,
      andereErsatzverbindungAnkunftsDatum: fourYearsAgoSchema,
      andereErsatzverbindungAnkunftsZeit: timeSchema,
      bereich: hiddenInputSchema(stringOptionalSchema),
      direktAnkunftsDatum: hiddenInputSchema(fourYearsAgoSchema),
      direktAnkunftsZeit: hiddenInputSchema(timeSchema),
    },
  },
  flugdatenZusaetzlicheAngaben: {
    stepId: "flugdaten/zusaetzliche-angaben",
    pageSchema: {
      zusaetzlicheAngaben: schemaOrEmptyString(stringRequiredSchema),
    },
  },
} satisfies PagesConfig;
