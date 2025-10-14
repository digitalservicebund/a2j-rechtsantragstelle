import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const geldEinklagenGerichtPruefenPages = {
  introStart: {
    stepId: "gericht-pruefen/intro/start",
  },
  forderungFragen: {
    stepId: "gericht-pruefen/forderung/fragen",
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
    pageSchema: { sachgebietAusgeschlossen: YesNoAnswer },
  },
  sachgebietBesondere: {
    stepId: "gericht-pruefen/sachgebiet/besondere",
    pageSchema: {
      besondere: z.enum([
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
  sachgebietVersicherungVersicherungsnummer: {
    stepId: "gericht-pruefen/sachgebiet/versicherung-versicherungsnummer",
    pageSchema: { versicherungsnummer: YesNoAnswer },
  },
  sachgebietReiseArt: {
    stepId: "gericht-pruefen/sachgebiet/reise-art",
    pageSchema: { reiseArt: z.enum(["flug", "andereReise"]) },
  },
  sachgebietReiseStopp: {
    stepId: "gericht-pruefen/sachgebiet/reise-stopp",
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
    stepId: "gericht-pruefen/klagende-person/ergebnis/abbruch",
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
  beklagtePersonFuerWen: {
    stepId: "gericht-pruefen/beklagte-person/fuer-wen",
    pageSchema: { fuerWenBeklagen: z.enum(["person", "organisation"]) },
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
  gerichtSuchePostleitzahlBeklagtePerson: {
    stepId: "gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
  },
} as const satisfies PagesConfig;
