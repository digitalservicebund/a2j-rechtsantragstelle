import { and, not } from "xstate";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import type { Config } from "~/services/flow/server/buildFlowController";
import { type BeratungshilfeVorabcheckContext } from "./context";
import { isIncomeTooHigh } from "./isIncomeTooHigh";
import type { GenericGuard } from "../../guards.server";

const staatlicheLeistungenYes: GenericGuard<
  BeratungshilfeVorabcheckContext
> = ({ context }) =>
  context.staatlicheLeistungen === "grundsicherung" ||
  context.staatlicheLeistungen === "asylbewerberleistungen";

export const beratungshilfeVorabcheckXstateConfig = {
  id: "/beratungshilfe/vorabcheck",
  initial: "rechtsschutzversicherung",
  states: {
    rechtsschutzversicherung: {
      on: {
        SUBMIT: [
          {
            target: (await isFeatureFlagEnabled("showRSVIteration"))
              ? "rechtsschutzversicherung-details"
              : "ergebnis/rechtsschutzversicherung-abbruch",
            guard: ({ context }) => context.rechtsschutzversicherung === "yes",
          },
          {
            target: "wurde-verklagt",
            guard: ({ context }) => context.rechtsschutzversicherung === "no",
          },
        ],
      },
    },
    "rechtsschutzversicherung-details": {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.rsvCoverage === "yes",
            target: "ergebnis/rechtsschutzversicherung-abbruch",
          },
          {
            guard: ({ context }) => context.rsvCoverage === "tooExpensive",
            target: "rechtsschutzversicherung-hinweis-selbstbeteiligung",
          },
          {
            guard: ({ context }) => context.rsvCoverage === "unknown",
            target: "ergebnis/rechtsschutzversicherung-ungewiss-abbruch",
          },
          "rechtsschutzversicherung-hinweis-kostenuebernahme",
        ],
        BACK: "rechtsschutzversicherung",
      },
    },
    "rechtsschutzversicherung-hinweis-selbstbeteiligung": {
      on: {
        SUBMIT: "wurde-verklagt",
        BACK: "rechtsschutzversicherung-details",
      },
    },
    "rechtsschutzversicherung-hinweis-kostenuebernahme": {
      on: {
        SUBMIT: "wurde-verklagt",
        BACK: "rechtsschutzversicherung-details",
      },
    },
    "ergebnis/rechtsschutzversicherung-ungewiss-abbruch": {
      on: { BACK: "rechtsschutzversicherung-details" },
    },
    "ergebnis/rechtsschutzversicherung-abbruch": {
      on: {
        BACK: (await isFeatureFlagEnabled("showRSVIteration"))
          ? "rechtsschutzversicherung-details"
          : "rechtsschutzversicherung",
      },
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
        BACK: (await isFeatureFlagEnabled("showRSVIteration"))
          ? [
              {
                target: "rechtsschutzversicherung-hinweis-selbstbeteiligung",
                guard: ({ context }) => context.rsvCoverage === "tooExpensive",
              },
              {
                target: "rechtsschutzversicherung-hinweis-kostenuebernahme",
                guard: ({ context }) =>
                  context.rsvCoverage === "partly" ||
                  context.rsvCoverage === "no",
              },
              "rechtsschutzversicherung",
            ]
          : "rechtsschutzversicherung",
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
            guard: ({ context }) => context.beratungshilfeBeantragt === "no",
          },
          {
            target: "ergebnis/beratungshilfe-beantragt-abbruch",
            guard: ({ context }) => context.beratungshilfeBeantragt === "yes",
          },
        ],
        BACK: "hamburg-oder-bremen",
      },
    },
    "ergebnis/beratungshilfe-beantragt-abbruch": {
      on: { BACK: "beratungshilfe-beantragt" },
    },
    eigeninitiative: {
      on: {
        SUBMIT: [
          {
            target: "bereich",
            guard: ({ context }) => context.eigeninitiative === "yes",
          },
          {
            target: "eigeninitiative-warnung",
            guard: ({ context }) => context.eigeninitiative === "no",
          },
        ],
        BACK: "beratungshilfe-beantragt",
      },
    },
    "eigeninitiative-warnung": {
      on: {
        SUBMIT: {
          target: "bereich",
        },
        BACK: "eigeninitiative",
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
            guard: ({ context }) => context.eigeninitiative === "no",
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
            guard: and([
              staatlicheLeistungenYes,
              ({ context }) => context.eigeninitiative === "no",
            ]),
          },
          {
            target: "ergebnis/staatliche-leistungen-abschluss-ja",
            guard: staatlicheLeistungenYes,
          },
          {
            target: "vermoegen",
            guard: ({ context }) =>
              context.staatlicheLeistungen === "buergergeld" ||
              context.staatlicheLeistungen === "keine",
          },
        ],
        BACK: "bereich",
      },
    },
    "ergebnis/staatliche-leistungen-abschluss-ja": {
      on: {
        BACK: "staatliche-leistungen",
      },
    },
    "ergebnis/staatliche-leistungen-abschluss-vielleicht": {
      on: {
        BACK: "staatliche-leistungen",
      },
    },
    vermoegen: {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/vermoegen-abschluss-vielleicht",
            guard: ({ context }) =>
              context.vermoegen === "below_10k" &&
              context.staatlicheLeistungen === "buergergeld" &&
              context.eigeninitiative === "no",
          },
          {
            target: "ergebnis/vermoegen-abschluss-ja",
            guard: ({ context }) =>
              context.vermoegen === "below_10k" &&
              context.staatlicheLeistungen === "buergergeld",
          },
          {
            target: "erwerbstaetigkeit",
            guard: ({ context }) => context.vermoegen === "below_10k",
          },
          {
            target: "ergebnis/vermoegen-abbruch",
            guard: ({ context }) => context.vermoegen === "above_10k",
          },
        ],
        BACK: "staatliche-leistungen",
      },
    },
    "ergebnis/vermoegen-abschluss-ja": {
      on: {
        BACK: "vermoegen",
      },
    },
    "ergebnis/vermoegen-abschluss-vielleicht": {
      on: {
        BACK: "vermoegen",
      },
    },
    "ergebnis/vermoegen-abbruch": {
      on: {
        BACK: "vermoegen",
      },
    },
    erwerbstaetigkeit: {
      on: {
        SUBMIT: {
          target: "partnerschaft",
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
            guard: ({ context }) => context.genauigkeit === "no",
          },
          {
            target: "einkommen",
            guard: ({ context }) => context.genauigkeit === "yes",
          },
        ],
        BACK: "partnerschaft",
      },
    },
    "kinder-kurz": {
      on: {
        SUBMIT: [
          {
            target: "kinder-anzahl-kurz",
            guard: ({ context }) => context.kinderKurz === "yes",
          },
          {
            target: "verfuegbares-einkommen",
            guard: ({ context }) => context.kinderKurz === "no",
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
          guard: ({ context }) => context.kinderAnzahlKurz != null,
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
            guard: ({ context }) =>
              context.verfuegbaresEinkommen === "no" &&
              context.eigeninitiative === "yes",
          },
          {
            target: "ergebnis/verfuegbares-einkommen-abschluss-vielleicht",
            guard: ({ context }) => context.verfuegbaresEinkommen === "no",
          },
          {
            target: "ergebnis/verfuegbares-einkommen-abschluss-nein",
            guard: ({ context }) => context.verfuegbaresEinkommen === "yes",
          },
        ],
        BACK: [
          {
            target: "kinder-anzahl-kurz",
            guard: ({ context }) => context.kinderKurz === "yes",
          },
          {
            target: "kinder-kurz",
          },
        ],
      },
    },
    "ergebnis/verfuegbares-einkommen-abschluss-ja": {
      on: {
        BACK: "verfuegbares-einkommen",
      },
    },
    "ergebnis/verfuegbares-einkommen-abschluss-vielleicht": {
      on: {
        BACK: "verfuegbares-einkommen",
      },
    },
    "ergebnis/verfuegbares-einkommen-abschluss-nein": {
      on: {
        BACK: "verfuegbares-einkommen",
      },
    },
    einkommen: {
      on: {
        SUBMIT: [
          {
            target: "einkommen-partner",
            guard: ({ context }) => context.partnerschaft === "yes",
          },
          {
            target: "kinder",
            guard: ({ context }) => context.partnerschaft === "no",
          },
        ],
        BACK: "genauigkeit",
      },
    },
    "einkommen-partner": {
      on: {
        SUBMIT: {
          target: "kinder",
        },
        BACK: "einkommen",
      },
    },
    kinder: {
      on: {
        SUBMIT: [
          {
            target: "kinder-anzahl",
            guard: ({ context }) => context.kinder === "yes",
          },
          {
            target: "unterhalt",
            guard: ({ context }) => context.kinder === "no",
          },
        ],
        BACK: [
          {
            target: "einkommen-partner",
            guard: ({ context }) => context.partnerschaft === "yes",
          },
          {
            target: "einkommen",
            guard: ({ context }) => context.partnerschaft === "no",
          },
        ],
      },
    },
    "kinder-anzahl": {
      on: {
        SUBMIT: {
          target: "einkommen-kinder",
          guard: ({ context }) =>
            context.kids?.kids6Below != undefined ||
            context.kids?.kids7To14 != undefined ||
            context.kids?.kids15To18 != undefined ||
            context.kids?.kids18Above != undefined,
        },
        BACK: "kinder",
      },
    },
    "einkommen-kinder": {
      on: {
        SUBMIT: {
          target: "unterhalt",
          guard: ({ context }) => context.einkommenKinder != undefined,
        },
        BACK: "kinder-anzahl",
      },
    },
    unterhalt: {
      on: {
        SUBMIT: [
          {
            target: "unterhalt-summe",
            guard: ({ context }) => context.unterhalt === "yes",
          },
          {
            target: "miete",
            guard: ({ context }) => context.unterhalt === "no",
          },
        ],
        BACK: [
          {
            target: "einkommen-kinder",
            guard: ({ context }) => context.kinder === "yes",
          },
          {
            target: "kinder",
            guard: ({ context }) => context.kinder === "no",
          },
        ],
      },
    },
    "unterhalt-summe": {
      on: {
        SUBMIT: {
          target: "miete",
          guard: ({ context }) => context.unterhaltSumme != undefined,
        },
        BACK: "unterhalt",
      },
    },
    miete: {
      on: {
        SUBMIT: {
          target: "weitere-zahlungen-summe",
          guard: ({ context }) => context.miete != undefined,
        },
        BACK: [
          {
            target: "unterhalt-summe",
            guard: ({ context }) => context.unterhalt === "yes",
          },
          {
            target: "unterhalt",
            guard: ({ context }) => context.unterhalt === "no",
          },
        ],
      },
    },
    "weitere-zahlungen-summe": {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/weitere-zahlungen-summe-abschluss-vielleicht",
            guard: and([
              not(isIncomeTooHigh),
              ({ context }) => context.eigeninitiative == "no",
            ]),
          },
          {
            target: "ergebnis/weitere-zahlungen-summe-abschluss-nein",
            guard: isIncomeTooHigh,
          },
          {
            target: "ergebnis/weitere-zahlungen-summe-abschluss-ja",
            guard: ({ context }) => context.weitereZahlungenSumme != undefined,
          },
        ],
        BACK: "miete",
      },
    },
    "ergebnis/weitere-zahlungen-summe-abschluss-vielleicht": {
      on: {
        BACK: "weitere-zahlungen-summe",
      },
    },
    "ergebnis/weitere-zahlungen-summe-abschluss-nein": {
      on: {
        BACK: "weitere-zahlungen-summe",
      },
    },
    "ergebnis/weitere-zahlungen-summe-abschluss-ja": {
      on: {
        BACK: "weitere-zahlungen-summe",
      },
    },
  },
} satisfies Config<BeratungshilfeVorabcheckContext>;
