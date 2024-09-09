import type { Config } from "~/services/flow/server/buildFlowController";
import type { BeratungshilfeVorabcheckContext } from "./context";

export const beratungshilfeVorabcheckXstateConfig = {
  id: "/beratungshilfe/vorabcheck",
  initial: "rechtsschutzversicherung",
  states: {
    rechtsschutzversicherung: {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/rechtsschutzversicherung-abbruch",
            guard: ({ context }) => context.rechtsschutzversicherung === "yes",
          },
          {
            target: "wurde-verklagt",
            guard: ({ context }) => context.rechtsschutzversicherung === "no",
          },
        ],
      },
    },
    "ergebnis/rechtsschutzversicherung-abbruch": {
      on: { BACK: "rechtsschutzversicherung" },
    },
    "wurde-verklagt": {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/wurde-verklagt-abbruch",
            guard: ({ context }) => context.wurdeVerklagt === "yes",
          },
          {
            target: "klage-eingereicht",
            guard: ({ context }) => context.wurdeVerklagt === "no",
          },
        ],
        BACK: "rechtsschutzversicherung",
      },
    },
    "ergebnis/wurde-verklagt-abbruch": {
      on: { BACK: "wurde-verklagt" },
    },
    "klage-eingereicht": {
      on: {
        SUBMIT: [
          {
            target: "hamburg-oder-bremen",
            guard: ({ context }) => context.klageEingereicht === "no",
          },
          {
            target: "ergebnis/klage-eingereicht-abbruch",
            guard: ({ context }) => context.klageEingereicht === "yes",
          },
        ],
        BACK: "wurde-verklagt",
      },
    },
    "ergebnis/klage-eingereicht-abbruch": {
      on: {
        BACK: "klage-eingereicht",
      },
    },
    "hamburg-oder-bremen": {
      on: {
        SUBMIT: [
          {
            target: "beratungshilfe-beantragt",
            guard: ({ context }) => context.hamburgOderBremen === "no",
          },
          {
            target: "ergebnis/hamburg-oder-bremen-abbruch",
            guard: ({ context }) => context.hamburgOderBremen === "yes",
          },
        ],
        BACK: "klage-eingereicht",
      },
    },
    "ergebnis/hamburg-oder-bremen-abbruch": {
      on: { BACK: "hamburg-oder-bremen" },
    },
    "beratungshilfe-beantragt": {
      on: {
        SUBMIT: [
          {
            target: "eigeninitiative",
            guard: "beratungshilfeBeantragtNo",
          },
          {
            target: "ergebnis/beratungshilfe-beantragt-abbruch",
            guard: "beratungshilfeBeantragtYes",
          },
        ],
        BACK: {
          target: "hamburg-oder-bremen",
        },
      },
    },
    "ergebnis/beratungshilfe-beantragt-abbruch": {
      on: {
        BACK: {
          target: "beratungshilfe-beantragt",
        },
      },
    },
    eigeninitiative: {
      on: {
        SUBMIT: [
          {
            target: "bereich",
            guard: "eigeninitiativeYes",
          },
          {
            target: "eigeninitiative-warnung",
            guard: "eigeninitiativeNo",
          },
        ],
        BACK: {
          target: "beratungshilfe-beantragt",
        },
      },
    },
    "eigeninitiative-warnung": {
      on: {
        SUBMIT: {
          target: "bereich",
        },
        BACK: {
          target: "eigeninitiative",
        },
      },
    },
    bereich: {
      meta: {
        customAnalyticsEventName: "beratungshilfe vorabcheck bereich submitted",
      },
      on: {
        SUBMIT: "staatliche-leistungen",
        BACK: [
          {
            target: "eigeninitiative-warnung",
            guard: "eigeninitiativeNo",
          },
          "eigeninitiative",
        ],
      },
    },
    "staatliche-leistungen": {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/staatliche-leistungen-abschluss-vielleicht",
            guard: "staatlicheLeistungenYesButNoEigeninitiative",
          },
          {
            target: "ergebnis/staatliche-leistungen-abschluss-ja",
            guard: "staatlicheLeistungenYes",
          },
          {
            target: "vermoegen",
            guard: "staatlicheLeistungenNo",
          },
        ],
        BACK: "bereich",
      },
    },
    "ergebnis/staatliche-leistungen-abschluss-ja": {
      on: {
        BACK: {
          target: "staatliche-leistungen",
        },
      },
    },
    "ergebnis/staatliche-leistungen-abschluss-vielleicht": {
      on: {
        BACK: {
          target: "staatliche-leistungen",
        },
      },
    },
    vermoegen: {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/vermoegen-abschluss-vielleicht",
            guard: "vermoegenBelow10kAndBuergergeldButNoEigeninitiative",
          },
          {
            target: "ergebnis/vermoegen-abschluss-ja",
            guard: "vermoegenBelow10kAndBuergergeld",
          },
          {
            target: "erwerbstaetigkeit",
            guard: "vermoegenBelow10k",
          },
          {
            target: "ergebnis/vermoegen-abbruch",
            guard: "vermoegenAbove10k",
          },
        ],
        BACK: {
          target: "staatliche-leistungen",
        },
      },
    },
    "ergebnis/vermoegen-abschluss-ja": {
      on: {
        BACK: {
          target: "vermoegen",
        },
      },
    },
    "ergebnis/vermoegen-abschluss-vielleicht": {
      on: {
        BACK: {
          target: "vermoegen",
        },
      },
    },
    "ergebnis/vermoegen-abbruch": {
      on: {
        BACK: {
          target: "vermoegen",
        },
      },
    },
    erwerbstaetigkeit: {
      on: {
        SUBMIT: {
          target: "partnerschaft",
          guard: "erwerbstaetigkeitYesOrNo",
        },
        BACK: {
          target: "vermoegen",
        },
      },
    },
    partnerschaft: {
      on: {
        SUBMIT: {
          target: "genauigkeit",
          guard: "partnerschaftYesOrNo",
        },
        BACK: {
          target: "erwerbstaetigkeit",
        },
      },
    },
    genauigkeit: {
      on: {
        SUBMIT: [
          {
            target: "kinder-kurz",
            guard: "genauigkeitNo",
          },
          {
            target: "einkommen",
            guard: "genauigkeitYes",
          },
        ],
        BACK: {
          target: "partnerschaft",
        },
      },
    },
    "kinder-kurz": {
      on: {
        SUBMIT: [
          {
            target: "kinder-anzahl-kurz",
            guard: "kinderKurzYes",
          },
          {
            target: "verfuegbares-einkommen",
            guard: "kinderKurzNo",
          },
        ],
        BACK: {
          target: "genauigkeit",
        },
      },
    },
    "kinder-anzahl-kurz": {
      on: {
        SUBMIT: {
          target: "verfuegbares-einkommen",
          guard: "kinderAnzahlKurzFilled",
        },
        BACK: {
          target: "kinder-kurz",
        },
      },
    },
    "verfuegbares-einkommen": {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/verfuegbares-einkommen-abschluss-ja",
            guard: "verfuegbaresEinkommenNoAndTriedFreeActions",
          },
          {
            target: "ergebnis/verfuegbares-einkommen-abschluss-vielleicht",
            guard: "verfuegbaresEinkommenNo",
          },
          {
            target: "ergebnis/verfuegbares-einkommen-abschluss-nein",
            guard: "verfuegbaresEinkommenYes",
          },
        ],
        BACK: [
          {
            target: "kinder-anzahl-kurz",
            guard: "kinderKurzYes",
          },
          {
            target: "kinder-kurz",
          },
        ],
      },
    },
    "ergebnis/verfuegbares-einkommen-abschluss-ja": {
      on: {
        BACK: {
          target: "verfuegbares-einkommen",
        },
      },
    },
    "ergebnis/verfuegbares-einkommen-abschluss-vielleicht": {
      on: {
        BACK: {
          target: "verfuegbares-einkommen",
        },
      },
    },
    "ergebnis/verfuegbares-einkommen-abschluss-nein": {
      on: {
        BACK: {
          target: "verfuegbares-einkommen",
        },
      },
    },
    einkommen: {
      on: {
        SUBMIT: [
          {
            target: "einkommen-partner",
            guard: "partnerschaftYes",
          },
          {
            target: "kinder",
            guard: "partnerschaftNo",
          },
        ],
        BACK: {
          target: "genauigkeit",
        },
      },
    },
    "einkommen-partner": {
      on: {
        SUBMIT: {
          target: "kinder",
        },
        BACK: {
          target: "einkommen",
        },
      },
    },
    kinder: {
      on: {
        SUBMIT: [
          {
            target: "kinder-anzahl",
            guard: "kinderYes",
          },
          {
            target: "unterhalt",
            guard: "kinderNo",
          },
        ],
        BACK: [
          {
            target: "einkommen-partner",
            guard: "partnerschaftYes",
          },
          {
            target: "einkommen",
            guard: "partnerschaftNo",
          },
        ],
      },
    },
    "kinder-anzahl": {
      on: {
        SUBMIT: {
          target: "einkommen-kinder",
          guard: "anyKinderAnzahlFilled",
        },
        BACK: {
          target: "kinder",
        },
      },
    },
    "einkommen-kinder": {
      on: {
        SUBMIT: {
          target: "unterhalt",
          guard: "einkommenKinderFilled",
        },
        BACK: {
          target: "kinder-anzahl",
        },
      },
    },
    unterhalt: {
      on: {
        SUBMIT: [
          {
            target: "unterhalt-summe",
            guard: "unterhaltYes",
          },
          {
            target: "miete",
            guard: "unterhaltNo",
          },
        ],
        BACK: [
          {
            target: "einkommen-kinder",
            guard: "kinderYes",
          },
          {
            target: "kinder",
            guard: "kinderNo",
          },
        ],
      },
    },
    "unterhalt-summe": {
      on: {
        SUBMIT: {
          target: "miete",
          guard: "unterhaltSummeFilled",
        },
        BACK: {
          target: "unterhalt",
        },
      },
    },
    miete: {
      on: {
        SUBMIT: {
          target: "weitere-zahlungen-summe",
          guard: "mieteFilled",
        },
        BACK: [
          {
            target: "unterhalt-summe",
            guard: "unterhaltYes",
          },
          {
            target: "unterhalt",
            guard: "unterhaltNo",
          },
        ],
      },
    },
    "weitere-zahlungen-summe": {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/weitere-zahlungen-summe-abschluss-vielleicht",
            guard: "weitereZahlungenSummeWithWarnings",
          },
          {
            target: "ergebnis/weitere-zahlungen-summe-abschluss-nein",
            guard: "weitereZahlungenSummeIncomeTooHigh",
          },
          {
            target: "ergebnis/weitere-zahlungen-summe-abschluss-ja",
            guard: "weitereZahlungenSummeFilled",
          },
        ],
        BACK: {
          target: "miete",
        },
      },
    },
    "ergebnis/weitere-zahlungen-summe-abschluss-vielleicht": {
      on: {
        BACK: {
          target: "weitere-zahlungen-summe",
        },
      },
    },
    "ergebnis/weitere-zahlungen-summe-abschluss-nein": {
      on: {
        BACK: {
          target: "weitere-zahlungen-summe",
        },
      },
    },
    "ergebnis/weitere-zahlungen-summe-abschluss-ja": {
      on: {
        BACK: {
          target: "weitere-zahlungen-summe",
        },
      },
    },
  },
} satisfies Config<BeratungshilfeVorabcheckContext>;
