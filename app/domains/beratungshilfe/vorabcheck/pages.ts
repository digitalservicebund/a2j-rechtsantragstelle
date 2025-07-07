import { z } from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { staatlicheLeistungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { kidsSchema } from "./kidsSchema";
import { bereich } from "../formular/rechtsproblem/userData";

export const beratungshilfeVorabcheckPages = {
  rechtsschutzversicherung: {
    stepId: "rechtsschutzversicherung",
    pageSchema: { rechtsschutzversicherung: YesNoAnswer },
  },
  rechtsschutzversicherungDetails: {
    stepId: "rechtsschutzversicherung-details",
    pageSchema: {
      rsvCoverage: z.enum(
        ["yes", "partly", "tooExpensive", "no", "unknown"],
        customRequiredErrorMessage,
      ),
    },
  },
  rechtsschutzversicherungAbbruch: {
    stepId: "ergebnis/rechtsschutzversicherung-abbruch",
  },
  rechtsschutzversicherungHinweisSelbstbeteiligung: {
    stepId: "rechtsschutzversicherung-hinweis-selbstbeteiligung",
  },
  rechtsschutzversicherungUngewissAbbruch: {
    stepId: "ergebnis/rechtsschutzversicherung-ungewiss-abbruch",
  },
  rechtsschutzversicherungHinweisKostenuebernahme: {
    stepId: "rechtsschutzversicherung-hinweis-kostenuebernahme",
  },
  wurdeVerklagt: {
    stepId: "wurde-verklagt",
    pageSchema: { wurdeVerklagt: YesNoAnswer },
  },
  wurdeVerklagtAbbruch: {
    stepId: "ergebnis/wurde-verklagt-abbruch",
  },
  klageEingereicht: {
    stepId: "klage-eingereicht",
    pageSchema: { klageEingereicht: YesNoAnswer },
  },
  klageEingereichtAbbruch: {
    stepId: "ergebnis/klage-eingereicht-abbruch",
  },
  hamburgOderBremen: {
    stepId: "hamburg-oder-bremen",
    pageSchema: { hamburgOderBremen: YesNoAnswer },
  },
  hamburgOderBremenAbbruch: {
    stepId: "ergebnis/hamburg-oder-bremen-abbruch",
  },
  beratungshilfeBeantragt: {
    stepId: "beratungshilfe-beantragt",
    pageSchema: { beratungshilfeBeantragt: YesNoAnswer },
  },
  beratungshilfeBeantragtAbbruch: {
    stepId: "ergebnis/beratungshilfe-beantragt-abbruch",
  },
  eigeninitiative: {
    stepId: "eigeninitiative",
    pageSchema: { eigeninitiative: YesNoAnswer },
  },
  eigeninitiativeWarnung: { stepId: "eigeninitiative-warnung" },
  bereich: { stepId: "bereich", pageSchema: { bereich } },
  staatlicheLeistungen: {
    stepId: "staatliche-leistungen",
    pageSchema: { staatlicheLeistungen: staatlicheLeistungenInputSchema },
  },
  staatlicheLeistungenAbschlussVielleicht: {
    stepId: "ergebnis/staatliche-leistungen-abschluss-vielleicht",
  },
  staatlicheLeistungenAbschlussJa: {
    stepId: "ergebnis/staatliche-leistungen-abschluss-ja",
  },
  vermoegen: {
    stepId: "vermoegen",
    pageSchema: {
      vermoegen: z.enum(["below_10k", "above_10k"], customRequiredErrorMessage),
    },
  },
  vermoegenAbschlussJa: {
    stepId: "ergebnis/vermoegen-abschluss-ja",
  },
  vermoegenAbschlussVielleicht: {
    stepId: "ergebnis/vermoegen-abschluss-vielleicht",
  },
  vermoegenAbschlussAbbruch: {
    stepId: "ergebnis/vermoegen-abbruch",
  },
  erwerbstaetigkeit: {
    stepId: "erwerbstaetigkeit",
    pageSchema: { erwerbstaetigkeit: YesNoAnswer },
  },
  partnerschaft: {
    stepId: "partnerschaft",
    pageSchema: { partnerschaft: YesNoAnswer },
  },
  genauigkeit: {
    stepId: "genauigkeit",
    pageSchema: { genauigkeit: YesNoAnswer },
  },
  kinderKurz: {
    stepId: "kinder-kurz",
    pageSchema: { kinderKurz: YesNoAnswer },
  },
  kinderAnzahlKurz: {
    stepId: "kinder-anzahl-kurz",
    pageSchema: { kinderAnzahlKurz: buildKidsCountValidationSchema() },
  },
  verfuegbaresEinkommen: {
    stepId: "verfuegbares-einkommen",
    pageSchema: { verfuegbaresEinkommen: YesNoAnswer },
  },
  verfuegbaresEinkommenAbschlussJa: {
    stepId: "ergebnis/verfuegbares-einkommen-abschluss-ja",
  },
  verfuegbaresEinkommenAbschlussVielleicht: {
    stepId: "ergebnis/verfuegbares-einkommen-abschluss-vielleicht",
  },
  verfuegbaresEinkommenAbschlussNein: {
    stepId: "ergebnis/verfuegbares-einkommen-abschluss-nein",
  },
  einkommen: {
    stepId: "einkommen",
    pageSchema: { einkommen: buildMoneyValidationSchema() },
  },
  einkommenPartner: {
    stepId: "einkommen-partner",
    pageSchema: { einkommenPartner: buildMoneyValidationSchema() },
  },
  kinder: {
    stepId: "kinder",
    pageSchema: { kinder: YesNoAnswer },
  },
  kinderAnzahl: {
    stepId: "kinder-anzahl",
    pageSchema: { kids: kidsSchema },
  },
  einkommenKinder: {
    stepId: "einkommen-kinder",
    pageSchema: { einkommenKinder: buildMoneyValidationSchema() },
  },
  unterhalt: {
    stepId: "unterhalt",
    pageSchema: { unterhalt: YesNoAnswer },
  },
  unterhaltSumme: {
    stepId: "unterhalt-summe",
    pageSchema: { unterhaltSumme: buildMoneyValidationSchema() },
  },
  miete: {
    stepId: "miete",
    pageSchema: { miete: buildMoneyValidationSchema() },
  },
  weitereZahlungenSumme: {
    stepId: "weitere-zahlungen-summe",
    pageSchema: { weitereZahlungenSumme: buildMoneyValidationSchema() },
  },
  weitereZahlungenSummeAbschlussJa: {
    stepId: "ergebnis/weitere-zahlungen-summe-abschluss-ja",
  },
  weitereZahlungenSummeAbschlussVielleicht: {
    stepId: "ergebnis/weitere-zahlungen-summe-abschluss-vielleicht",
  },
  weitereZahlungenSummeAbschlussNein: {
    stepId: "ergebnis/weitere-zahlungen-summe-abschluss-nein",
  },
} as const satisfies PagesConfig;
