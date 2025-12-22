import mapValues from "lodash/mapValues";
import type { Config } from "~/services/flow/server/types";
import { kontopfaendungWegweiserPages } from "./pages";
import { type KontopfaendungWegweiserUserData } from "./userData";

const stepIds = mapValues(kontopfaendungWegweiserPages, (v) => v.stepId);

export const kontopfaendungWegweiserXstateConfig = {
  id: "/kontopfaendung/wegweiser",
  initial: stepIds.start,
  states: {
    [stepIds.start]: { on: { SUBMIT: stepIds.kontopfaendung } },
    [stepIds.kontopfaendung]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.pKonto,
            guard: ({ context }) => context.hasKontopfaendung === "ja",
          },
          {
            target: stepIds.ergebnisKeineKontopfaendung,
            guard: ({ context }) => context.hasKontopfaendung === "nein",
          },
        ],
        BACK: stepIds.start,
      },
    },
    [stepIds.ergebnisKeineKontopfaendung]: {
      on: { BACK: stepIds.kontopfaendung },
    },
    [stepIds.pKonto]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.zwischenseiteUnterhalt,
            guard: ({ context }) =>
              context.hasPKonto === "ja" || context.hasPKonto === "nein",
          },
          {
            target: stepIds.pKontoProbleme,
            guard: ({ context }) =>
              context.hasPKonto === "nichtAktiv" ||
              context.hasPKonto === "nichtEingerichtet",
          },
        ],
        BACK: stepIds.kontopfaendung,
      },
    },
    [stepIds.pKontoProbleme]: {
      on: {
        SUBMIT: stepIds.zwischenseiteUnterhalt,
        BACK: stepIds.pKonto,
      },
    },
    [stepIds.zwischenseiteUnterhalt]: {
      on: {
        SUBMIT: stepIds.kinder,
        BACK: [
          {
            target: stepIds.pKonto,
            guard: ({ context }) =>
              context.hasPKonto === "ja" || context.hasPKonto === "nein",
          },
          stepIds.pKontoProbleme,
        ],
      },
    },
    [stepIds.kinder]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.kinderWohnenZusammen,
            guard: ({ context }) => context.hasKinder === "yes",
          },
          {
            target: stepIds.partner,
            guard: ({ context }) => context.hasKinder === "no",
          },
        ],
        BACK: stepIds.zwischenseiteUnterhalt,
      },
    },
    [stepIds.kinderWohnenZusammen]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.kinderUnterhalt,
            guard: ({ context }) =>
              context.kinderWohnenZusammen === "nein" ||
              context.kinderWohnenZusammen === "teilweise",
          },
          stepIds.partner,
        ],
        BACK: stepIds.kinder,
      },
    },
    [stepIds.kinderUnterhalt]: {
      on: {
        SUBMIT: stepIds.partner,
        BACK: stepIds.kinderWohnenZusammen,
      },
    },
    [stepIds.partner]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.partnerUnterhalt,
            guard: ({ context }) => context.verheiratet === "geschieden",
          },
          {
            target: stepIds.partnerWohnenZusammen,
            guard: ({ context }) => context.verheiratet === "ja",
          },
          stepIds.zwischenseiteEinkuenfte,
        ],
        BACK: [
          {
            target: stepIds.kinderUnterhalt,
            guard: ({ context }) =>
              context.hasKinder === "yes" &&
              (context.kinderWohnenZusammen === "nein" ||
                context.kinderWohnenZusammen === "teilweise"),
          },
          {
            target: stepIds.kinderWohnenZusammen,
            guard: ({ context }) => context.hasKinder === "yes",
          },
          stepIds.kinder,
        ],
      },
    },
    [stepIds.partnerWohnenZusammen]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.zwischenseiteEinkuenfte,
            guard: ({ context }) => context.partnerWohnenZusammen === "yes",
          },
          {
            target: stepIds.partnerUnterhalt,
            guard: ({ context }) => context.partnerWohnenZusammen === "no",
          },
        ],
        BACK: stepIds.partner,
      },
    },
    [stepIds.partnerUnterhalt]: {
      on: {
        SUBMIT: stepIds.zwischenseiteEinkuenfte,
        BACK: [
          {
            target: stepIds.partnerWohnenZusammen,
            guard: ({ context }) =>
              context.verheiratet === "ja" &&
              context.partnerWohnenZusammen === "no",
          },
          stepIds.partner,
        ],
      },
    },
    [stepIds.zwischenseiteEinkuenfte]: {
      on: {
        SUBMIT: stepIds.arbeit,
        BACK: [
          {
            target: stepIds.partnerUnterhalt,
            guard: ({ context }) =>
              (context.verheiratet === "ja" &&
                context.partnerWohnenZusammen === "no") ||
              context.verheiratet === "geschieden",
          },
          {
            target: stepIds.partnerWohnenZusammen,
            guard: ({ context }) =>
              context.verheiratet === "ja" &&
              context.partnerWohnenZusammen === "yes",
          },
          stepIds.partner,
        ],
      },
    },
    [stepIds.arbeit]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.arbeitArt,
            guard: ({ context }) => context.hasArbeit === "yes",
          },
          stepIds.sozialleistungen,
        ],
        BACK: stepIds.zwischenseiteEinkuenfte,
      },
    },
    [stepIds.arbeitArt]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.sozialleistungen,
            guard: ({ context }) =>
              (context.arbeitArt?.selbstaendig === "on" &&
                context.arbeitArt?.angestellt === "off") ||
              (context.arbeitArt?.selbstaendig === "off" &&
                context.arbeitArt?.angestellt === "off"),
          },
          stepIds.nachzahlungArbeitgeber,
        ],
        BACK: stepIds.arbeit,
      },
    },
    [stepIds.nachzahlungArbeitgeber]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.hoeheNachzahlungArbeitgeber,
            guard: ({ context }) => context.nachzahlungArbeitgeber === "yes",
          },
          stepIds.einmalzahlungArbeitgeber,
        ],
        BACK: stepIds.arbeitArt,
      },
    },
    [stepIds.hoeheNachzahlungArbeitgeber]: {
      on: {
        SUBMIT: stepIds.einmalzahlungArbeitgeber,
        BACK: stepIds.nachzahlungArbeitgeber,
      },
    },
    [stepIds.einmalzahlungArbeitgeber]: {
      on: {
        SUBMIT: stepIds.sozialleistungen,
        BACK: [
          {
            target: stepIds.hoeheNachzahlungArbeitgeber,
            guard: ({ context }) => context.nachzahlungArbeitgeber === "yes",
          },
          stepIds.nachzahlungArbeitgeber,
        ],
      },
    },
    [stepIds.sozialleistungen]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.sozialleistungNachzahlung,
            guard: ({ context }) =>
              context.hasSozialleistungen === "buergergeld" ||
              context.hasSozialleistungen === "grundsicherungSozialhilfe" ||
              context.hasSozialleistungen === "asylbewerberleistungen",
          },
          {
            target: stepIds.kindergeld,
            guard: ({ context }) => context.hasKinder === "yes",
          },
          stepIds.wohngeld,
        ],
        BACK: [
          {
            target: stepIds.einmalzahlungArbeitgeber,
            guard: ({ context }) =>
              (context.hasArbeit === "yes" &&
                context.nachzahlungArbeitgeber === "yes") ||
              context.nachzahlungArbeitgeber === "no",
          },
          {
            target: stepIds.arbeitArt,
            guard: ({ context }) =>
              (context.arbeitArt?.selbstaendig === "on" &&
                context.arbeitArt?.angestellt === "off") ||
              (context.arbeitArt?.selbstaendig === "off" &&
                context.arbeitArt?.angestellt === "off"),
          },
          stepIds.arbeit,
        ],
      },
    },
    [stepIds.sozialleistungNachzahlung]: {
      on: {
        SUBMIT: stepIds.sozialleistungenEinmalzahlung,
        BACK: stepIds.sozialleistungen,
      },
    },
    [stepIds.sozialleistungenEinmalzahlung]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.kindergeld,
            guard: ({ context }) => context.hasKinder === "yes",
          },
          stepIds.wohngeld,
        ],
        BACK: stepIds.sozialleistungNachzahlung,
      },
    },
    [stepIds.pflegegeld]: {
      on: {
        SUBMIT: stepIds.rente,
        BACK: [
          {
            target: stepIds.wohngeldNachzahlung,
            guard: ({ context }) =>
              context.hasWohngeld === "yes" && context.wohngeld === "selbst",
          },
          {
            target: stepIds.wohngeldEmpfaenger,
            guard: ({ context }) =>
              context.hasWohngeld === "yes" && context.wohngeld === "fremd",
          },
          stepIds.wohngeld,
        ],
      },
    },
    [stepIds.kindergeld]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.kindergeldNachzahlung,
            guard: ({ context }) => context.hasKindergeld === "yes",
          },
          stepIds.wohngeld,
        ],
        BACK: [
          {
            target: stepIds.sozialleistungenEinmalzahlung,
            guard: ({ context }) => context.hasSozialleistungen !== "nein",
          },
          stepIds.sozialleistungen,
        ],
      },
    },
    [stepIds.kindergeldNachzahlung]: {
      on: {
        SUBMIT: stepIds.wohngeld,
        BACK: [
          {
            target: stepIds.kindergeld,
            guard: ({ context }) =>
              context.hasKinder === "yes" && context.hasKindergeld === "yes",
          },
          stepIds.sozialleistungenEinmalzahlung,
        ],
      },
    },
    [stepIds.wohngeld]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.wohngeldEmpfaenger,
            guard: ({ context }) => context.hasWohngeld === "yes",
          },
          stepIds.pflegegeld,
        ],
        BACK: [
          {
            target: stepIds.kindergeldNachzahlung,
            guard: ({ context }) =>
              context.hasKindergeldNachzahlung === "yes" &&
              context.hasKindergeld === "yes",
          },
          {
            target: stepIds.kindergeld,
            guard: ({ context }) => context.hasKinder === "yes",
          },
          {
            target: stepIds.sozialleistungenEinmalzahlung,
            guard: ({ context }) =>
              (context.hasSozialleistungen !== "nein" &&
                context.hasSozialleistungenEinmalzahlung === "yes") ||
              context.hasSozialleistungenEinmalzahlung === "no",
          },
          stepIds.sozialleistungen,
        ],
      },
    },
    [stepIds.wohngeldEmpfaenger]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.wohngeldNachzahlung,
            guard: ({ context }) => context.wohngeld === "selbst",
          },
          stepIds.pflegegeld,
        ],
        BACK: stepIds.wohngeld,
      },
    },
    [stepIds.wohngeldNachzahlung]: {
      on: {
        SUBMIT: stepIds.pflegegeld,
        BACK: stepIds.wohngeldEmpfaenger,
      },
    },
    [stepIds.rente]: {
      on: {
        SUBMIT: stepIds.ergebnisNaechsteSchritte,
        BACK: stepIds.pflegegeld,
      },
    },
    [stepIds.ergebnisNaechsteSchritte]: {
      on: {
        BACK: [
          {
            target: stepIds.rente,
          },
        ],
      },
    },
  },
} satisfies Config<KontopfaendungWegweiserUserData>;
