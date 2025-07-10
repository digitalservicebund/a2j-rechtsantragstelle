import mapValues from "lodash/mapValues";
import { and, not } from "xstate";
import type { Config } from "~/services/flow/server/buildFlowController";
import { isIncomeTooHigh } from "./isIncomeTooHigh";
import { beratungshilfeVorabcheckPages } from "./pages";
import { type BeratungshilfeVorabcheckUserData } from "./userData";
import type { GenericGuard } from "../../guards.server";

const stepIds = mapValues(beratungshilfeVorabcheckPages, (v) => v.stepId);

const staatlicheLeistungenYes: GenericGuard<
  BeratungshilfeVorabcheckUserData
> = ({ context }) =>
  context.staatlicheLeistungen === "grundsicherung" ||
  context.staatlicheLeistungen === "asylbewerberleistungen";

export const beratungshilfeVorabcheckXstateConfig = {
  id: "/beratungshilfe/vorabcheck",
  initial: stepIds.start,
  states: {
    [stepIds.start]: {
      on: { SUBMIT: stepIds.rechtsschutzversicherung },
    },
    [stepIds.rechtsschutzversicherung]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.rechtsschutzversicherungDetails,
            guard: ({ context }) => context.rechtsschutzversicherung === "yes",
          },
          {
            target: stepIds.wurdeVerklagt,
            guard: ({ context }) => context.rechtsschutzversicherung === "no",
          },
        ],
        BACK: stepIds.start,
      },
    },
    [stepIds.rechtsschutzversicherungDetails]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.rsvCoverage === "yes",
            target: stepIds.rechtsschutzversicherungAbbruch,
          },
          {
            guard: ({ context }) => context.rsvCoverage === "tooExpensive",
            target: stepIds.rechtsschutzversicherungHinweisSelbstbeteiligung,
          },
          {
            guard: ({ context }) => context.rsvCoverage === "unknown",
            target: stepIds.rechtsschutzversicherungUngewissAbbruch,
          },
          stepIds.rechtsschutzversicherungHinweisKostenuebernahme,
        ],
        BACK: stepIds.rechtsschutzversicherung,
      },
    },
    [stepIds.rechtsschutzversicherungHinweisSelbstbeteiligung]: {
      on: {
        SUBMIT: stepIds.wurdeVerklagt,
        BACK: stepIds.rechtsschutzversicherungDetails,
      },
    },
    [stepIds.rechtsschutzversicherungHinweisKostenuebernahme]: {
      on: {
        SUBMIT: stepIds.wurdeVerklagt,
        BACK: stepIds.rechtsschutzversicherungDetails,
      },
    },
    [stepIds.rechtsschutzversicherungUngewissAbbruch]: {
      on: { BACK: stepIds.rechtsschutzversicherungDetails },
    },
    [stepIds.rechtsschutzversicherungAbbruch]: {
      on: { BACK: stepIds.rechtsschutzversicherungDetails },
    },
    [stepIds.wurdeVerklagt]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.wurdeVerklagtAbbruch,
            guard: ({ context }) => context.wurdeVerklagt === "yes",
          },
          {
            target: stepIds.klageEingereicht,
            guard: ({ context }) => context.wurdeVerklagt === "no",
          },
        ],
        BACK: [
          {
            target: stepIds.rechtsschutzversicherungHinweisSelbstbeteiligung,
            guard: ({ context }) => context.rsvCoverage === "tooExpensive",
          },
          {
            target: stepIds.rechtsschutzversicherungHinweisKostenuebernahme,
            guard: ({ context }) =>
              context.rsvCoverage === "partly" || context.rsvCoverage === "no",
          },
          stepIds.rechtsschutzversicherung,
        ],
      },
    },
    [stepIds.wurdeVerklagtAbbruch]: {
      on: { BACK: stepIds.wurdeVerklagt },
    },
    [stepIds.klageEingereicht]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.hamburgOderBremen,
            guard: ({ context }) => context.klageEingereicht === "no",
          },
          {
            target: stepIds.klageEingereichtAbbruch,
            guard: ({ context }) => context.klageEingereicht === "yes",
          },
        ],
        BACK: stepIds.wurdeVerklagt,
      },
    },
    [stepIds.klageEingereichtAbbruch]: {
      on: {
        BACK: stepIds.klageEingereicht,
      },
    },
    [stepIds.hamburgOderBremen]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.beratungshilfeBeantragt,
            guard: ({ context }) => context.hamburgOderBremen === "no",
          },
          {
            target: stepIds.hamburgOderBremenAbbruch,
            guard: ({ context }) => context.hamburgOderBremen === "yes",
          },
        ],
        BACK: stepIds.klageEingereicht,
      },
    },
    [stepIds.hamburgOderBremenAbbruch]: {
      on: { BACK: stepIds.hamburgOderBremen },
    },
    [stepIds.beratungshilfeBeantragt]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.eigeninitiative,
            guard: ({ context }) => context.beratungshilfeBeantragt === "no",
          },
          {
            target: stepIds.beratungshilfeBeantragtAbbruch,
            guard: ({ context }) => context.beratungshilfeBeantragt === "yes",
          },
        ],
        BACK: stepIds.hamburgOderBremen,
      },
    },
    [stepIds.beratungshilfeBeantragtAbbruch]: {
      on: { BACK: stepIds.beratungshilfeBeantragt },
    },
    [stepIds.eigeninitiative]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.bereich,
            guard: ({ context }) => context.eigeninitiative === "yes",
          },
          {
            target: stepIds.eigeninitiativeWarnung,
            guard: ({ context }) => context.eigeninitiative === "no",
          },
        ],
        BACK: stepIds.beratungshilfeBeantragt,
      },
    },
    [stepIds.eigeninitiativeWarnung]: {
      on: {
        SUBMIT: {
          target: stepIds.bereich,
        },
        BACK: stepIds.eigeninitiative,
      },
    },
    [stepIds.bereich]: {
      meta: {
        customAnalyticsEventName: "beratungshilfe vorabcheck bereich submitted",
      },
      on: {
        SUBMIT: stepIds.staatlicheLeistungen,
        BACK: [
          {
            target: stepIds.eigeninitiativeWarnung,
            guard: ({ context }) => context.eigeninitiative === "no",
          },
          stepIds.eigeninitiative,
        ],
      },
    },
    [stepIds.staatlicheLeistungen]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.staatlicheLeistungenAbschlussVielleicht,
            guard: and([
              staatlicheLeistungenYes,
              ({ context }) => context.eigeninitiative === "no",
            ]),
          },
          {
            target: stepIds.staatlicheLeistungenAbschlussJa,
            guard: staatlicheLeistungenYes,
          },
          {
            target: stepIds.vermoegen,
            guard: ({ context }) =>
              context.staatlicheLeistungen === "buergergeld" ||
              context.staatlicheLeistungen === "keine",
          },
        ],
        BACK: stepIds.bereich,
      },
    },
    [stepIds.staatlicheLeistungenAbschlussJa]: {
      on: {
        BACK: stepIds.staatlicheLeistungen,
      },
    },
    [stepIds.staatlicheLeistungenAbschlussVielleicht]: {
      on: {
        BACK: stepIds.staatlicheLeistungen,
      },
    },
    [stepIds.vermoegen]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.vermoegenAbschlussVielleicht,
            guard: ({ context }) =>
              context.vermoegen === "below_10k" &&
              context.staatlicheLeistungen === "buergergeld" &&
              context.eigeninitiative === "no",
          },
          {
            target: stepIds.vermoegenAbschlussJa,
            guard: ({ context }) =>
              context.vermoegen === "below_10k" &&
              context.staatlicheLeistungen === "buergergeld",
          },
          {
            target: stepIds.erwerbstaetigkeit,
            guard: ({ context }) => context.vermoegen === "below_10k",
          },
          {
            target: stepIds.vermoegenAbschlussAbbruch,
            guard: ({ context }) => context.vermoegen === "above_10k",
          },
        ],
        BACK: stepIds.staatlicheLeistungen,
      },
    },
    [stepIds.vermoegenAbschlussJa]: {
      on: {
        BACK: stepIds.vermoegen,
      },
    },
    [stepIds.vermoegenAbschlussVielleicht]: {
      on: {
        BACK: stepIds.vermoegen,
      },
    },
    [stepIds.vermoegenAbschlussAbbruch]: {
      on: {
        BACK: stepIds.vermoegen,
      },
    },
    [stepIds.erwerbstaetigkeit]: {
      on: {
        SUBMIT: {
          target: stepIds.partnerschaft,
        },
        BACK: {
          target: stepIds.vermoegen,
        },
      },
    },
    [stepIds.partnerschaft]: {
      on: {
        SUBMIT: {
          target: stepIds.genauigkeit,
        },
        BACK: {
          target: stepIds.erwerbstaetigkeit,
        },
      },
    },
    [stepIds.genauigkeit]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.kinderKurz,
            guard: ({ context }) => context.genauigkeit === "no",
          },
          {
            target: stepIds.einkommen,
            guard: ({ context }) => context.genauigkeit === "yes",
          },
        ],
        BACK: stepIds.partnerschaft,
      },
    },
    [stepIds.kinderKurz]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.kinderAnzahlKurz,
            guard: ({ context }) => context.kinderKurz === "yes",
          },
          {
            target: stepIds.verfuegbaresEinkommen,
            guard: ({ context }) => context.kinderKurz === "no",
          },
        ],
        BACK: {
          target: stepIds.genauigkeit,
        },
      },
    },
    [stepIds.kinderAnzahlKurz]: {
      on: {
        SUBMIT: {
          target: stepIds.verfuegbaresEinkommen,
          guard: ({ context }) => context.kinderAnzahlKurz != null,
        },
        BACK: {
          target: stepIds.kinderKurz,
        },
      },
    },
    [stepIds.verfuegbaresEinkommen]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.verfuegbaresEinkommenAbschlussJa,
            guard: ({ context }) =>
              context.verfuegbaresEinkommen === "no" &&
              context.eigeninitiative === "yes",
          },
          {
            target: stepIds.verfuegbaresEinkommenAbschlussVielleicht,
            guard: ({ context }) => context.verfuegbaresEinkommen === "no",
          },
          {
            target: stepIds.verfuegbaresEinkommenAbschlussNein,
            guard: ({ context }) => context.verfuegbaresEinkommen === "yes",
          },
        ],
        BACK: [
          {
            target: stepIds.kinderAnzahlKurz,
            guard: ({ context }) => context.kinderKurz === "yes",
          },
          {
            target: stepIds.kinderKurz,
          },
        ],
      },
    },
    [stepIds.verfuegbaresEinkommenAbschlussJa]: {
      on: {
        BACK: stepIds.verfuegbaresEinkommen,
      },
    },
    [stepIds.verfuegbaresEinkommenAbschlussVielleicht]: {
      on: {
        BACK: stepIds.verfuegbaresEinkommen,
      },
    },
    [stepIds.verfuegbaresEinkommenAbschlussNein]: {
      on: {
        BACK: stepIds.verfuegbaresEinkommen,
      },
    },
    einkommen: {
      on: {
        SUBMIT: [
          {
            target: stepIds.einkommenPartner,
            guard: ({ context }) => context.partnerschaft === "yes",
          },
          {
            target: stepIds.kinder,
            guard: ({ context }) => context.partnerschaft === "no",
          },
        ],
        BACK: stepIds.genauigkeit,
      },
    },
    [stepIds.einkommenPartner]: {
      on: {
        SUBMIT: {
          target: stepIds.kinder,
        },
        BACK: stepIds.einkommen,
      },
    },
    [stepIds.kinder]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.kinderAnzahl,
            guard: ({ context }) => context.kinder === "yes",
          },
          {
            target: stepIds.unterhalt,
            guard: ({ context }) => context.kinder === "no",
          },
        ],
        BACK: [
          {
            target: stepIds.einkommenPartner,
            guard: ({ context }) => context.partnerschaft === "yes",
          },
          {
            target: stepIds.einkommen,
            guard: ({ context }) => context.partnerschaft === "no",
          },
        ],
      },
    },
    [stepIds.kinderAnzahl]: {
      on: {
        SUBMIT: {
          target: stepIds.einkommenKinder,
          guard: ({ context }) =>
            context.kids?.kids6Below != undefined ||
            context.kids?.kids7To14 != undefined ||
            context.kids?.kids15To18 != undefined ||
            context.kids?.kids18Above != undefined,
        },
        BACK: stepIds.kinder,
      },
    },
    [stepIds.einkommenKinder]: {
      on: {
        SUBMIT: {
          target: stepIds.unterhalt,
          guard: ({ context }) => context.einkommenKinder != undefined,
        },
        BACK: stepIds.kinderAnzahl,
      },
    },
    unterhalt: {
      on: {
        SUBMIT: [
          {
            target: stepIds.unterhaltSumme,
            guard: ({ context }) => context.unterhalt === "yes",
          },
          {
            target: stepIds.miete,
            guard: ({ context }) => context.unterhalt === "no",
          },
        ],
        BACK: [
          {
            target: stepIds.einkommenKinder,
            guard: ({ context }) => context.kinder === "yes",
          },
          {
            target: stepIds.kinder,
            guard: ({ context }) => context.kinder === "no",
          },
        ],
      },
    },
    [stepIds.unterhaltSumme]: {
      on: {
        SUBMIT: {
          target: stepIds.miete,
          guard: ({ context }) => context.unterhaltSumme != undefined,
        },
        BACK: stepIds.unterhalt,
      },
    },
    miete: {
      on: {
        SUBMIT: {
          target: stepIds.weitereZahlungenSumme,
          guard: ({ context }) => context.miete != undefined,
        },
        BACK: [
          {
            target: stepIds.unterhaltSumme,
            guard: ({ context }) => context.unterhalt === "yes",
          },
          {
            target: stepIds.unterhalt,
            guard: ({ context }) => context.unterhalt === "no",
          },
        ],
      },
    },
    [stepIds.weitereZahlungenSumme]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.weitereZahlungenSummeAbschlussVielleicht,
            guard: and([
              not(isIncomeTooHigh),
              ({ context }) => context.eigeninitiative == "no",
            ]),
          },
          {
            target: stepIds.weitereZahlungenSummeAbschlussNein,
            guard: isIncomeTooHigh,
          },
          {
            target: stepIds.weitereZahlungenSummeAbschlussJa,
            guard: ({ context }) => context.weitereZahlungenSumme != undefined,
          },
        ],
        BACK: stepIds.miete,
      },
    },
    [stepIds.weitereZahlungenSummeAbschlussVielleicht]: {
      on: { BACK: stepIds.weitereZahlungenSumme },
    },
    [stepIds.weitereZahlungenSummeAbschlussNein]: {
      on: { BACK: stepIds.weitereZahlungenSumme },
    },
    [stepIds.weitereZahlungenSummeAbschlussJa]: {
      on: { BACK: stepIds.weitereZahlungenSumme },
    },
  },
} satisfies Config<BeratungshilfeVorabcheckUserData>;
