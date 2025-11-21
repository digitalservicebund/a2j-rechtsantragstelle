import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const geldEinklagenGerichtPruefenPages = {
  introStart: {
    stepId: "gericht-pruefen/intro/start",
  },
  forderungWas: {
    stepId: "gericht-pruefen/forderung/was",
    pageSchema: { forderung: z.enum(["maximal5000", "etwasAnderes"]) },
  },
  forderungErrorEtwasAnderes: {
    stepId: "gericht-pruefen/forderung/ergebnis/etwas-anderes",
  },
  sachgebietInfo: {
    stepId: "gericht-pruefen/sachgebiet/info",
  },
  sachgebietAusgeschlossen: {
    stepId: "gericht-pruefen/sachgebiet/ausgeschlossen",
    pageSchema: { ausgeschlossen: YesNoAnswer },
  },
  sachgebietBesondere: {
    stepId: "gericht-pruefen/sachgebiet/besondere",
    pageSchema: {
      sachgebiet: z.enum([
        "miete",
        "versicherung",
        "schaden",
        "reisen",
        "verkehrsunfall",
        "urheberrecht",
        "anderesRechtsproblem",
      ]),
    },
  },
  sachgebietMietePachtVertrag: {
    stepId: "gericht-pruefen/sachgebiet/miete-pacht-vertrag",
    pageSchema: { mietePachtVertrag: YesNoAnswer },
  },
  sachgebietMietePachtRaum: {
    stepId: "gericht-pruefen/sachgebiet/miete-pacht-raum",
    pageSchema: { mietePachtRaum: YesNoAnswer },
  },
  sachgebietVersicherungVertrag: {
    stepId: "gericht-pruefen/sachgebiet/versicherung-vertrag",
    pageSchema: { versicherungVertrag: YesNoAnswer },
  },
  sachgebietVersicherungVersicherungsnehmer: {
    stepId: "gericht-pruefen/sachgebiet/versicherung-versicherungsnehmer",
    pageSchema: { versicherungsnehmer: YesNoAnswer },
  },
  sachgebietReiseArt: {
    stepId: "gericht-pruefen/sachgebiet/reise-art",
    pageSchema: { reiseArt: z.enum(["flug", "andereReise"]) },
  },
  sachgebietReiseInfoFlug: {
    stepId: "gericht-pruefen/sachgebiet/ergebnis/reise-flug",
  },
  sachgebietVerkehrsunfallStrassenverkehr: {
    stepId: "gericht-pruefen/sachgebiet/verkehrsunfall-strassenverkehr",
    pageSchema: { verkehrsunfallStrassenverkehr: YesNoAnswer },
  },
  klagendePersonFuerWen: {
    stepId: "gericht-pruefen/klagende-person/fuer-wen",
    pageSchema: { fuerWenKlagen: z.enum(["selbst", "organisation"]) },
  },
  klagendePersonErrorAbbruch: {
    stepId: "gericht-pruefen/klagende-person/ergebnis/organisation-abbruch",
  },
  klagendePersonVerbraucher: {
    stepId: "gericht-pruefen/klagende-person/verbraucher",
    pageSchema: { klagendeVerbraucher: YesNoAnswer },
  },
  klagendePersonKaufmann: {
    stepId: "gericht-pruefen/klagende-person/kaufmann",
    pageSchema: { klagendeKaufmann: YesNoAnswer },
  },
  klagendePersonVertrag: {
    stepId: "gericht-pruefen/klagende-person/vertrag",
    pageSchema: { klagendeVertrag: YesNoAnswer },
  },
  klagendePersonHaustuergeschaeft: {
    stepId: "gericht-pruefen/klagende-person/haustuergeschaeft",
    pageSchema: { klagendeHaustuergeschaeft: YesNoAnswer },
  },
  beklagtePersonGegenWen: {
    stepId: "gericht-pruefen/beklagte-person/gegen-wen",
    pageSchema: { gegenWenBeklagen: z.enum(["person", "organisation"]) },
  },
  beklagtePersonGeldVerdienen: {
    stepId: "gericht-pruefen/beklagte-person/geld-verdienen",
    pageSchema: { beklagtePersonGeldVerdienen: YesNoAnswer },
  },
  beklagtePersonKaufmann: {
    stepId: "gericht-pruefen/beklagte-person/kaufmann",
    pageSchema: { beklagtePersonKaufmann: z.enum(["yes", "no", "unknown"]) },
  },
  beklagtePersonGerichtsstandsvereinbarung: {
    stepId: "gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
    pageSchema: { gerichtsstandsvereinbarung: YesNoAnswer },
  },
  gerichtSuchenPostleitzahlBeklagtePerson: {
    stepId: "gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    pageSchema: {
      postleitzahlBeklagtePerson: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  gerichtSuchenStrasseNummerBeklagtePerson: {
    stepId: "gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
    pageSchema: {
      strasseBeklagte: stringRequiredSchema,
      strasseNummerBeklagte: germanHouseNumberSchema,
    },
  },
  gerichtSuchenPostleitzahlWohnraum: {
    stepId: "gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
    pageSchema: {
      postleitzahlSecondary: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  gerichtSuchenPostleitzahlKlagendePerson: {
    stepId: "gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
    pageSchema: {
      postleitzahlSecondary: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  gerichtSuchenPostleitzahlUnerlaubtePerson: {
    stepId: "gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
    pageSchema: {
      postleitzahlSecondary: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  gerichtSuchenPostleitzahlVerkehrsunfall: {
    stepId: "gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
    pageSchema: {
      postleitzahlSecondary: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  gerichtSuchenPostleitzahlGerichtsstandsvereinbarung: {
    stepId:
      "gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
    pageSchema: {
      postleitzahlSecondary: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  gerichtSuchenStrasseNummerSekundaer: {
    stepId: "gericht-pruefen/gericht-suchen/strasse-nummer-sekundaer",
    pageSchema: {
      strasseSekundaer: stringRequiredSchema,
      strasseNummerSekundaer: germanHouseNumberSchema,
    },
  },
  zustaendigesGerichtPilotGericht: {
    stepId: "gericht-pruefen/zustaendiges-gericht/pilot-gericht",
  },
} as const satisfies PagesConfig;
