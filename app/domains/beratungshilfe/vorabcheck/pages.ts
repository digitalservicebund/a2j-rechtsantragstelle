import { z } from "zod";
import { staatlicheLeistungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { kidsSchema } from "./kidsSchema";
import type { PagesConfig } from "../../pageConfig";
import { bereich } from "../formular/rechtsproblem/userData";

export const beratungshilfeVorabcheckPages = {
  rechtsschutzversicherung: {
    url: "rechtsschutzversicherung",
    pageSchema: { rechtsschutzversicherung: YesNoAnswer },
  },
  rechtsschutzversicherungDetails: {
    url: "rechtsschutzversicherung-details",
    pageSchema: {
      rsvCoverage: z.enum(
        ["yes", "partly", "tooExpensive", "no", "unknown"],
        customRequiredErrorMessage,
      ),
    },
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
    pageSchema: { wurdeVerklagt: YesNoAnswer },
  },
  wurdeVerklagtAbbruch: {
    url: "ergebnis/wurde-verklagt-abbruch",
  },
  klageEingereicht: {
    url: "klage-eingereicht",
    pageSchema: { klageEingereicht: YesNoAnswer },
  },
  klageEingereichtAbbruch: {
    url: "ergebnis/klage-eingereicht-abbruch",
  },
  hamburgOderBremen: {
    url: "hamburg-oder-bremen",
    pageSchema: { hamburgOderBremen: YesNoAnswer },
  },
  hamburgOderBremenAbbruch: {
    url: "ergebnis/hamburg-oder-bremen-abbruch",
  },
  beratungshilfeBeantragt: {
    url: "beratungshilfe-beantragt",
    pageSchema: { beratungshilfeBeantragt: YesNoAnswer },
  },
  beratungshilfeBeantragtAbbruch: {
    url: "ergebnis/beratungshilfe-beantragt-abbruch",
  },
  eigeninitiative: {
    url: "eigeninitiative",
    pageSchema: { eigeninitiative: YesNoAnswer },
  },
  eigeninitiativeWarnung: { url: "eigeninitiative-warnung" },
  bereich: { url: "bereich", pageSchema: { bereich } },
  staatlicheLeistungen: {
    url: "staatliche-leistungen",
    pageSchema: { staatlicheLeistungen: staatlicheLeistungenInputSchema },
  },
  staatlicheLeistungenAbschlussVielleicht: {
    url: "ergebnis/staatliche-leistungen-abschluss-vielleicht",
  },
  staatlicheLeistungenAbschlussJa: {
    url: "ergebnis/staatliche-leistungen-abschluss-ja",
  },
  vermoegen: {
    url: "vermoegen",
    pageSchema: {
      vermoegen: z.enum(["below_10k", "above_10k"], customRequiredErrorMessage),
    },
  },
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
    pageSchema: { erwerbstaetigkeit: YesNoAnswer },
  },
  partnerschaft: {
    url: "partnerschaft",
    pageSchema: { partnerschaft: YesNoAnswer },
  },
  genauigkeit: {
    url: "genauigkeit",
    pageSchema: { genauigkeit: YesNoAnswer },
  },
  kinderKurz: {
    url: "kinder-kurz",
    pageSchema: { kinderKurz: YesNoAnswer },
  },
  kinderAnzahlKurz: {
    url: "kinder-anzahl-kurz",
    pageSchema: { kinderAnzahlKurz: buildKidsCountValidationSchema() },
  },
  verfuegbaresEinkommen: {
    url: "verfuegbares-einkommen",
    pageSchema: { verfuegbaresEinkommen: YesNoAnswer },
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
    pageSchema: { einkommen: buildMoneyValidationSchema() },
  },
  einkommenPartner: {
    url: "einkommen-partner",
    pageSchema: { einkommenPartner: buildMoneyValidationSchema() },
  },
  kinder: {
    url: "kinder",
    pageSchema: { kinder: YesNoAnswer },
  },
  kinderAnzahl: {
    url: "kinder-anzahl",
    pageSchema: { kids: kidsSchema },
  },
  einkommenKinder: {
    url: "einkommen-kinder",
    pageSchema: { einkommenKinder: buildMoneyValidationSchema() },
  },
  unterhalt: {
    url: "unterhalt",
    pageSchema: { unterhalt: YesNoAnswer },
  },
  unterhaltSumme: {
    url: "unterhalt-summe",
    pageSchema: { unterhaltSumme: buildMoneyValidationSchema() },
  },
  miete: {
    url: "miete",
    pageSchema: { miete: buildMoneyValidationSchema() },
  },
  weitereZahlungenSumme: {
    url: "weitere-zahlungen-summe",
    pageSchema: { weitereZahlungenSumme: buildMoneyValidationSchema() },
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
