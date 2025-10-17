import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { kontopfaendungWegweiserXstateConfig } from "../xStateConfig";

export const kontopfaendungWegweiserTestCases = {
  xstateConfig: kontopfaendungWegweiserXstateConfig,
  testcases: {
    yesKontopfaendung: [
      { stepId: "/start" },
      {
        stepId: "/kontopfaendung",
        userInput: { hasKontopfaendung: "ja" },
      },
      { stepId: "/p-konto" },
    ],
    noKontopfaendung: [
      { stepId: "/start" },
      {
        stepId: "/kontopfaendung",
        userInput: { hasKontopfaendung: "nein" },
      },
      { stepId: "/ergebnis/keine-kontopfaendung" },
    ],
    zwischenseiteUnterhalt: [
      {
        stepId: "/p-konto",
        userInput: { hasPKonto: "ja" },
      },
      {
        stepId: "/zwischenseite-unterhalt",
      },
    ],
    pKontoProbleme: [
      {
        stepId: "/p-konto",
        userInput: { hasPKonto: "nichtAktiv" },
      },
      { stepId: "/p-konto-probleme" },
    ],
    kinder: [
      { stepId: "/kinder", userInput: { hasKinder: "yes" } },
      {
        stepId: "/kinder-wohnen-zusammen",
        userInput: { kinderWohnenZusammen: "nein" },
      },
      {
        stepId: "/kinder-unterhalt",
        userInput: { kinderUnterhalt: "no" },
      },
      { stepId: "/partner" },
    ],
    partner: [
      {
        stepId: "/partner",
        userInput: { verheiratet: "ja" },
      },
      {
        stepId: "/partner-wohnen-zusammen",
        userInput: { partnerWohnenZusammen: "no" },
      },
      {
        stepId: "/partner-unterhalt",
        userInput: {
          partnerUnterhalt: "yes",
        },
      },
      { stepId: "/zwischenseite-einkuenfte" },
    ],
    zwischenseiteEinkuenfte: [
      {
        stepId: "/zwischenseite-einkuenfte",
      },
      { stepId: "/arbeit" },
    ],
    arbeit: [
      {
        stepId: "/arbeit",
        userInput: { hasArbeit: "yes" },
      },
      {
        stepId: "/arbeit-art",
        userInput: { arbeitArt: { angestellt: "on", selbstaendig: "off" } },
      },
      {
        stepId: "/nachzahlung-arbeitgeber",
        userInput: { nachzahlungArbeitgeber: "yes" },
      },
      {
        stepId: "/hoehe-nachzahlung-arbeitgeber",
        userInput: { arbeitgeberNachzahlungHigherThan: "yes" },
      },
      {
        stepId: "/einmalzahlung-arbeitgeber",
        userInput: {
          zahlungArbeitgeber: {
            urlaubsgeld: "off",
            weihnachtsgeld: "off",
            ueberstundenBezahlt: "off",
            abfindung: "off",
            anderes: "off",
            none: "on",
          },
        },
      },
      { stepId: "/sozialleistungen" },
    ],
    sozialleistungen: [
      {
        stepId: "/sozialleistungen",
        userInput: { hasSozialleistungen: "buergergeld" },
      },
      {
        stepId: "/sozialleistung-nachzahlung",
        userInput: { hasSozialleistungNachzahlung: "yes" },
      },
      {
        stepId: "/sozialleistungen-einmalzahlung",
        userInput: {
          hasKinder: "yes",
          hasSozialleistungenEinmalzahlung: "yes",
        },
      },
      { stepId: "/kindergeld" },
    ],
    kindergeld: [
      {
        stepId: "/kindergeld",
        userInput: { hasKinder: "yes", hasKindergeld: "yes" },
      },
      {
        stepId: "/kindergeld-nachzahlung",
        userInput: { hasKindergeldNachzahlung: "yes" },
      },
      { stepId: "/wohngeld" },
    ],
    wohngeld: [
      {
        stepId: "/wohngeld",
        userInput: {
          hasWohngeld: "yes",
        },
      },
      {
        stepId: "/wohngeld-empfaenger",
        userInput: { wohngeld: "selbst" },
      },
      {
        stepId: "/wohngeld-nachzahlung",
        userInput: { hasWohngeldNachzahlung: "yes" },
      },
      { stepId: "/pflegegeld" },
    ],
    pflegegeld: [
      {
        stepId: "/pflegegeld",
        userInput: { hasPflegegeld: "yes" },
      },
      { stepId: "/rente" },
    ],
    rente: [
      {
        stepId: "/rente",
        userInput: { hasRente: "yes" },
      },
      { stepId: "/ergebnis/naechste-schritte" },
    ],
    ergebnisNaechsteSchritte: [{ stepId: "/ergebnis/naechste-schritte" }],
  },
} satisfies FlowTestCases;
