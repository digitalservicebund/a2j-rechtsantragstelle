import mapValues from "lodash/mapValues";
import { and, not } from "xstate";
import type { Config } from "~/services/flow/server/buildFlowController";
import { isIncomeTooHigh } from "./isIncomeTooHigh";
import { beratungshilfeVorabcheckPages } from "./pages";
import { type BeratungshilfeVorabcheckUserData } from "./userData";
import type { GenericGuard } from "../../guards.server";

const stepUrls = mapValues(beratungshilfeVorabcheckPages, (v) => v.url);

const staatlicheLeistungenYes: GenericGuard<
  BeratungshilfeVorabcheckUserData
> = ({ context }) =>
  context.staatlicheLeistungen === "grundsicherung" ||
  context.staatlicheLeistungen === "asylbewerberleistungen";

export const beratungshilfeVorabcheckXstateConfig = {
  id: "/beratungshilfe/vorabcheck",
  initial: stepUrls.rechtsschutzversicherung,
  states: {
    [stepUrls.rechtsschutzversicherung]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.rechtsschutzversicherungDetails,
            guard: ({ context }) => context.rechtsschutzversicherung === "yes",
          },
          {
            target: stepUrls.wurdeVerklagt,
            guard: ({ context }) => context.rechtsschutzversicherung === "no",
          },
        ],
      },
    },
    [stepUrls.rechtsschutzversicherungDetails]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.rsvCoverage === "yes",
            target: stepUrls.rechtsschutzversicherungAbbruch,
          },
          {
            guard: ({ context }) => context.rsvCoverage === "tooExpensive",
            target: stepUrls.rechtsschutzversicherungHinweisSelbstbeteiligung,
          },
          {
            guard: ({ context }) => context.rsvCoverage === "unknown",
            target: stepUrls.rechtsschutzversicherungUngewissAbbruch,
          },
          stepUrls.rechtsschutzversicherungHinweisKostenuebernahme,
        ],
        BACK: stepUrls.rechtsschutzversicherung,
      },
    },
    [stepUrls.rechtsschutzversicherungHinweisSelbstbeteiligung]: {
      on: {
        SUBMIT: stepUrls.wurdeVerklagt,
        BACK: stepUrls.rechtsschutzversicherungDetails,
      },
    },
    [stepUrls.rechtsschutzversicherungHinweisKostenuebernahme]: {
      on: {
        SUBMIT: stepUrls.wurdeVerklagt,
        BACK: stepUrls.rechtsschutzversicherungDetails,
      },
    },
    [stepUrls.rechtsschutzversicherungUngewissAbbruch]: {
      on: { BACK: stepUrls.rechtsschutzversicherungDetails },
    },
    [stepUrls.rechtsschutzversicherungAbbruch]: {
      on: { BACK: stepUrls.rechtsschutzversicherungDetails },
    },
    [stepUrls.wurdeVerklagt]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.wurdeVerklagtAbbruch,
            guard: ({ context }) => context.wurdeVerklagt === "yes",
          },
          {
            target: stepUrls.klageEingereicht,
            guard: ({ context }) => context.wurdeVerklagt === "no",
          },
        ],
        BACK: [
          {
            target: stepUrls.rechtsschutzversicherungHinweisSelbstbeteiligung,
            guard: ({ context }) => context.rsvCoverage === "tooExpensive",
          },
          {
            target: stepUrls.rechtsschutzversicherungHinweisKostenuebernahme,
            guard: ({ context }) =>
              context.rsvCoverage === "partly" || context.rsvCoverage === "no",
          },
          stepUrls.rechtsschutzversicherung,
        ],
      },
    },
    [stepUrls.wurdeVerklagtAbbruch]: {
      on: { BACK: stepUrls.wurdeVerklagt },
    },
    [stepUrls.klageEingereicht]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.hamburgOderBremen,
            guard: ({ context }) => context.klageEingereicht === "no",
          },
          {
            target: stepUrls.klageEingereichtAbbruch,
            guard: ({ context }) => context.klageEingereicht === "yes",
          },
        ],
        BACK: stepUrls.wurdeVerklagt,
      },
    },
    [stepUrls.klageEingereichtAbbruch]: {
      on: {
        BACK: stepUrls.klageEingereicht,
      },
    },
    [stepUrls.hamburgOderBremen]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.beratungshilfeBeantragt,
            guard: ({ context }) => context.hamburgOderBremen === "no",
          },
          {
            target: stepUrls.hamburgOderBremenAbbruch,
            guard: ({ context }) => context.hamburgOderBremen === "yes",
          },
        ],
        BACK: stepUrls.klageEingereicht,
      },
    },
    [stepUrls.hamburgOderBremenAbbruch]: {
      on: { BACK: stepUrls.hamburgOderBremen },
    },
    [stepUrls.beratungshilfeBeantragt]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.eigeninitiative,
            guard: ({ context }) => context.beratungshilfeBeantragt === "no",
          },
          {
            target: stepUrls.beratungshilfeBeantragtAbbruch,
            guard: ({ context }) => context.beratungshilfeBeantragt === "yes",
          },
        ],
        BACK: stepUrls.hamburgOderBremen,
      },
    },
    [stepUrls.beratungshilfeBeantragtAbbruch]: {
      on: { BACK: stepUrls.beratungshilfeBeantragt },
    },
    [stepUrls.eigeninitiative]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.bereich,
            guard: ({ context }) => context.eigeninitiative === "yes",
          },
          {
            target: stepUrls.eigeninitiativeWarnung,
            guard: ({ context }) => context.eigeninitiative === "no",
          },
        ],
        BACK: stepUrls.beratungshilfeBeantragt,
      },
    },
    [stepUrls.eigeninitiativeWarnung]: {
      on: {
        SUBMIT: {
          target: stepUrls.bereich,
        },
        BACK: stepUrls.eigeninitiative,
      },
    },
    [stepUrls.bereich]: {
      meta: {
        customAnalyticsEventName: "beratungshilfe vorabcheck bereich submitted",
      },
      on: {
        SUBMIT: stepUrls.staatlicheLeistungen,
        BACK: [
          {
            target: stepUrls.eigeninitiativeWarnung,
            guard: ({ context }) => context.eigeninitiative === "no",
          },
          stepUrls.eigeninitiative,
        ],
      },
    },
    [stepUrls.staatlicheLeistungen]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.staatlicheLeistungenAbschlussVielleicht,
            guard: and([
              staatlicheLeistungenYes,
              ({ context }) => context.eigeninitiative === "no",
            ]),
          },
          {
            target: stepUrls.staatlicheLeistungenAbschlussJa,
            guard: staatlicheLeistungenYes,
          },
          {
            target: stepUrls.vermoegen,
            guard: ({ context }) =>
              context.staatlicheLeistungen === "buergergeld" ||
              context.staatlicheLeistungen === "keine",
          },
        ],
        BACK: stepUrls.bereich,
      },
    },
    [stepUrls.staatlicheLeistungenAbschlussJa]: {
      on: {
        BACK: stepUrls.staatlicheLeistungen,
      },
    },
    [stepUrls.staatlicheLeistungenAbschlussVielleicht]: {
      on: {
        BACK: stepUrls.staatlicheLeistungen,
      },
    },
    [stepUrls.vermoegen]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.vermoegenAbschlussVielleicht,
            guard: ({ context }) =>
              context.vermoegen === "below_10k" &&
              context.staatlicheLeistungen === "buergergeld" &&
              context.eigeninitiative === "no",
          },
          {
            target: stepUrls.vermoegenAbschlussJa,
            guard: ({ context }) =>
              context.vermoegen === "below_10k" &&
              context.staatlicheLeistungen === "buergergeld",
          },
          {
            target: stepUrls.erwerbstaetigkeit,
            guard: ({ context }) => context.vermoegen === "below_10k",
          },
          {
            target: stepUrls.vermoegenAbschlussAbbruch,
            guard: ({ context }) => context.vermoegen === "above_10k",
          },
        ],
        BACK: stepUrls.staatlicheLeistungen,
      },
    },
    [stepUrls.vermoegenAbschlussJa]: {
      on: {
        BACK: stepUrls.vermoegen,
      },
    },
    [stepUrls.vermoegenAbschlussVielleicht]: {
      on: {
        BACK: stepUrls.vermoegen,
      },
    },
    [stepUrls.vermoegenAbschlussAbbruch]: {
      on: {
        BACK: stepUrls.vermoegen,
      },
    },
    [stepUrls.erwerbstaetigkeit]: {
      on: {
        SUBMIT: {
          target: stepUrls.partnerschaft,
        },
        BACK: {
          target: stepUrls.vermoegen,
        },
      },
    },
    [stepUrls.partnerschaft]: {
      on: {
        SUBMIT: {
          target: stepUrls.genauigkeit,
        },
        BACK: {
          target: stepUrls.erwerbstaetigkeit,
        },
      },
    },
    [stepUrls.genauigkeit]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.kinderKurz,
            guard: ({ context }) => context.genauigkeit === "no",
          },
          {
            target: stepUrls.einkommen,
            guard: ({ context }) => context.genauigkeit === "yes",
          },
        ],
        BACK: stepUrls.partnerschaft,
      },
    },
    [stepUrls.kinderKurz]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.kinderAnzahlKurz,
            guard: ({ context }) => context.kinderKurz === "yes",
          },
          {
            target: stepUrls.verfuegbaresEinkommen,
            guard: ({ context }) => context.kinderKurz === "no",
          },
        ],
        BACK: {
          target: stepUrls.genauigkeit,
        },
      },
    },
    [stepUrls.kinderAnzahlKurz]: {
      on: {
        SUBMIT: {
          target: stepUrls.verfuegbaresEinkommen,
          guard: ({ context }) => context.kinderAnzahlKurz != null,
        },
        BACK: {
          target: stepUrls.kinderKurz,
        },
      },
    },
    [stepUrls.verfuegbaresEinkommen]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.verfuegbaresEinkommenAbschlussJa,
            guard: ({ context }) =>
              context.verfuegbaresEinkommen === "no" &&
              context.eigeninitiative === "yes",
          },
          {
            target: stepUrls.verfuegbaresEinkommenAbschlussVielleicht,
            guard: ({ context }) => context.verfuegbaresEinkommen === "no",
          },
          {
            target: stepUrls.verfuegbaresEinkommenAbschlussNein,
            guard: ({ context }) => context.verfuegbaresEinkommen === "yes",
          },
        ],
        BACK: [
          {
            target: stepUrls.kinderAnzahlKurz,
            guard: ({ context }) => context.kinderKurz === "yes",
          },
          {
            target: stepUrls.kinderKurz,
          },
        ],
      },
    },
    [stepUrls.verfuegbaresEinkommenAbschlussJa]: {
      on: {
        BACK: stepUrls.verfuegbaresEinkommen,
      },
    },
    [stepUrls.verfuegbaresEinkommenAbschlussVielleicht]: {
      on: {
        BACK: stepUrls.verfuegbaresEinkommen,
      },
    },
    [stepUrls.verfuegbaresEinkommenAbschlussNein]: {
      on: {
        BACK: stepUrls.verfuegbaresEinkommen,
      },
    },
    einkommen: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.einkommenPartner,
            guard: ({ context }) => context.partnerschaft === "yes",
          },
          {
            target: stepUrls.kinder,
            guard: ({ context }) => context.partnerschaft === "no",
          },
        ],
        BACK: stepUrls.genauigkeit,
      },
    },
    [stepUrls.einkommenPartner]: {
      on: {
        SUBMIT: {
          target: stepUrls.kinder,
        },
        BACK: stepUrls.einkommen,
      },
    },
    [stepUrls.kinder]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.kinderAnzahl,
            guard: ({ context }) => context.kinder === "yes",
          },
          {
            target: stepUrls.unterhalt,
            guard: ({ context }) => context.kinder === "no",
          },
        ],
        BACK: [
          {
            target: stepUrls.einkommenPartner,
            guard: ({ context }) => context.partnerschaft === "yes",
          },
          {
            target: stepUrls.einkommen,
            guard: ({ context }) => context.partnerschaft === "no",
          },
        ],
      },
    },
    [stepUrls.kinderAnzahl]: {
      on: {
        SUBMIT: {
          target: stepUrls.einkommenKinder,
          guard: ({ context }) =>
            context.kids?.kids6Below != undefined ||
            context.kids?.kids7To14 != undefined ||
            context.kids?.kids15To18 != undefined ||
            context.kids?.kids18Above != undefined,
        },
        BACK: stepUrls.kinder,
      },
    },
    [stepUrls.einkommenKinder]: {
      on: {
        SUBMIT: {
          target: stepUrls.unterhalt,
          guard: ({ context }) => context.einkommenKinder != undefined,
        },
        BACK: stepUrls.kinderAnzahl,
      },
    },
    unterhalt: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.unterhaltSumme,
            guard: ({ context }) => context.unterhalt === "yes",
          },
          {
            target: stepUrls.miete,
            guard: ({ context }) => context.unterhalt === "no",
          },
        ],
        BACK: [
          {
            target: stepUrls.einkommenKinder,
            guard: ({ context }) => context.kinder === "yes",
          },
          {
            target: stepUrls.kinder,
            guard: ({ context }) => context.kinder === "no",
          },
        ],
      },
    },
    [stepUrls.unterhaltSumme]: {
      on: {
        SUBMIT: {
          target: stepUrls.miete,
          guard: ({ context }) => context.unterhaltSumme != undefined,
        },
        BACK: stepUrls.unterhalt,
      },
    },
    miete: {
      on: {
        SUBMIT: {
          target: stepUrls.weitereZahlungenSumme,
          guard: ({ context }) => context.miete != undefined,
        },
        BACK: [
          {
            target: stepUrls.unterhaltSumme,
            guard: ({ context }) => context.unterhalt === "yes",
          },
          {
            target: stepUrls.unterhalt,
            guard: ({ context }) => context.unterhalt === "no",
          },
        ],
      },
    },
    [stepUrls.weitereZahlungenSumme]: {
      on: {
        SUBMIT: [
          {
            target: stepUrls.weitereZahlungenSummeAbschlussVielleicht,
            guard: and([
              not(isIncomeTooHigh),
              ({ context }) => context.eigeninitiative == "no",
            ]),
          },
          {
            target: stepUrls.weitereZahlungenSummeAbschlussNein,
            guard: isIncomeTooHigh,
          },
          {
            target: stepUrls.weitereZahlungenSummeAbschlussJa,
            guard: ({ context }) => context.weitereZahlungenSumme != undefined,
          },
        ],
        BACK: stepUrls.miete,
      },
    },
    [stepUrls.weitereZahlungenSummeAbschlussVielleicht]: {
      on: { BACK: stepUrls.weitereZahlungenSumme },
    },
    [stepUrls.weitereZahlungenSummeAbschlussNein]: {
      on: { BACK: stepUrls.weitereZahlungenSumme },
    },
    [stepUrls.weitereZahlungenSummeAbschlussJa]: {
      on: { BACK: stepUrls.weitereZahlungenSumme },
    },
  },
} satisfies Config<BeratungshilfeVorabcheckUserData>;
