import pick from "lodash/pick";
import { beratungshilfeVorabcheckInputSchema as schemas } from "./userData";
import type { PagesConfig } from "../../pageConfig";

export const beratungshilfeVorabcheckPages = {
  rechtsschutzversicherung: {
    url: "rechtsschutzversicherung",
    pageSchema: pick(schemas, "rechtsschutzversicherung"),
  },
  rechtsschutzversicherungDetails: {
    url: "rechtsschutzversicherung-details",
    pageSchema: pick(schemas, "rsvCoverage"),
  },
  rechtsschutzversicherungAbbruch: {
    url: "ergebnis/rechtsschutzversicherung-abbruch",
  },
  rechtsschutzversicherungHinweisSelbstbeteiligung: {
    url: "rechtsschutzversicherung-hinweis-selbstbeteiligung",
  },
  rechtsschutzversicherungUngewissAbbruch: {
    url: "ergebnis/rechtsschutzversicherung-ungewiss-abbruch",
  },
  rechtsschutzversicherungHinweisKostenuebernahme: {
    url: "rechtsschutzversicherung-hinweis-kostenuebernahme",
  },
  wurdeVerklagt: {
    url: "wurde-verklagt",
    pageSchema: pick(schemas, "wurdeVerklagt"),
  },
  wurdeVerklagtAbbruch: {
    url: "ergebnis/wurde-verklagt-abbruch",
  },
  klageEingereicht: {
    url: "klage-eingereicht",
    pageSchema: pick(schemas, "klageEingereicht"),
  },
  klageEingereichtAbbruch: {
    url: "ergebnis/klage-eingereicht-abbruch",
  },
  hamburgOderBremen: {
    url: "hamburg-oder-bremen",
    pageSchema: pick(schemas, "hamburgOderBremen"),
  },
  hamburgOderBremenAbbruch: {
    url: "ergebnis/hamburg-oder-bremen-abbruch",
  },
  beratungshilfeBeantragt: {
    url: "beratungshilfe-beantragt",
    pageSchema: pick(schemas, "beratungshilfeBeantragt"),
  },
  beratungshilfeBeantragtAbbruch: {
    url: "ergebnis/beratungshilfe-beantragt-abbruch",
  },
  eigeninitiative: {
    url: "eigeninitiative",
    pageSchema: pick(schemas, "eigeninitiative"),
  },
  eigeninitiativeWarnung: { url: "eigeninitiative-warnung" },
  bereich: { url: "bereich", pageSchema: pick(schemas, "bereich") },
  staatlicheLeistungen: {
    url: "staatliche-leistungen",
    pageSchema: pick(schemas, "staatlicheLeistungen"),
  },
  staatlicheLeistungenAbschlussVielleicht: {
    url: "ergebnis/staatliche-leistungen-abschluss-vielleicht",
  },
  staatlicheLeistungenAbschlussJa: {
    url: "ergebnis/staatliche-leistungen-abschluss-ja",
  },
  vermoegen: { url: "vermoegen", pageSchema: pick(schemas, "vermoegen") },
  vermoegenAbschlussJa: {
    url: "ergebnis/vermoegen-abschluss-ja",
  },
  vermoegenAbschlussVielleicht: {
    url: "ergebnis/vermoegen-abschluss-vielleicht",
  },
  vermoegenAbschlussAbbruch: {
    url: "ergebnis/vermoegen-abbruch",
  },
  erwerbstaetigkeit: {
    url: "erwerbstaetigkeit",
    pageSchema: pick(schemas, "erwerbstaetigkeit"),
  },
  partnerschaft: {
    url: "partnerschaft",
    pageSchema: pick(schemas, "partnerschaft"),
  },
  genauigkeit: {
    url: "genauigkeit",
    pageSchema: pick(schemas, "genauigkeit"),
  },
  kinderKurz: {
    url: "kinder-kurz",
    pageSchema: pick(schemas, "kinderKurz"),
  },
  kinderAnzahlKurz: {
    url: "kinder-anzahl-kurz",
    pageSchema: pick(schemas, "kinderAnzahlKurz"),
  },
  verfuegbaresEinkommen: {
    url: "verfuegbares-einkommen",
    pageSchema: pick(schemas, "verfuegbaresEinkommen"),
  },
  verfuegbaresEinkommenAbschlussJa: {
    url: "ergebnis/verfuegbares-einkommen-abschluss-ja",
  },
  verfuegbaresEinkommenAbschlussVielleicht: {
    url: "ergebnis/verfuegbares-einkommen-abschluss-vielleicht",
  },
  verfuegbaresEinkommenAbschlussNein: {
    url: "ergebnis/verfuegbares-einkommen-abschluss-nein",
  },
  einkommen: {
    url: "einkommen",
    pageSchema: pick(schemas, "einkommen"),
  },
  einkommenPartner: {
    url: "einkommen-partner",
    pageSchema: pick(schemas, "einkommenPartner"),
  },
  kinder: {
    url: "kinder",
    pageSchema: pick(schemas, "kinder"),
  },
  kinderAnzahl: {
    url: "kinder-anzahl",
    pageSchema: pick(schemas, "kids"),
  },
  einkommenKinder: {
    url: "einkommen-kinder",
    pageSchema: pick(schemas, "einkommenKinder"),
  },
  unterhalt: {
    url: "unterhalt",
    pageSchema: pick(schemas, "unterhalt"),
  },
  unterhaltSumme: {
    url: "unterhalt-summe",
    pageSchema: pick(schemas, "unterhaltSumme"),
  },
  miete: {
    url: "miete",
    pageSchema: pick(schemas, "miete"),
  },
  weitereZahlungenSumme: {
    url: "weitere-zahlungen-summe",
    pageSchema: pick(schemas, "weitereZahlungenSumme"),
  },
  weitereZahlungenSummeAbschlussJa: {
    url: "ergebnis/weitere-zahlungen-summe-abschluss-ja",
  },
  weitereZahlungenSummeAbschlussVielleicht: {
    url: "ergebnis/weitere-zahlungen-summe-abschluss-vielleicht",
  },
  weitereZahlungenSummeAbschlussNein: {
    url: "ergebnis/weitere-zahlungen-summe-abschluss-nein",
  },
} as const satisfies PagesConfig;
