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
    kinder: [{ stepId: "/kinder", userInput: { hasKinder: "yes" } }],
    kinderWohnenZusammen: [
      {
        stepId: "/kinder-wohnen-zusammen",
        userInput: { kinderWohnenZusammen: "nein" },
      },
    ],
    kinderUnterhalt: [
      {
        stepId: "/kinder-unterhalt",
        userInput: {
          kinderUnterhalt: "yes",
        },
      },
    ],
    partner: [
      {
        stepId: "/partner",
        userInput: { verheiratet: "ja" },
      },
    ],
    partnerWohnenZusammen: [
      {
        stepId: "/partner-wohnen-zusammen",
        userInput: { partnerWohnenZusammen: "no" },
      },
    ],
    partnerUnterhalt: [
      {
        stepId: "/partner-unterhalt",
        userInput: {
          partnerUnterhalt: "yes",
        },
      },
    ],
    zwischenseiteEinkuenfte: [
      {
        stepId: "/zwischenseite-einkuenfte",
      },
    ],
    arbeit: [{ stepId: "/arbeit", userInput: { hasArbeit: "yes" } }],
    arbeitArt: [
      {
        stepId: "/arbeit-art",
        userInput: { arbeitArt: { angestellt: "on", selbstaendig: "off" } },
      },
    ],
    nachzahlungArbeitgeber: [
      {
        stepId: "/nachzahlung-arbeitgeber",
        userInput: { nachzahlungArbeitgeber: "yes" },
      },
    ],
    hoeheNachzahlungArbeitgeber: [
      {
        stepId: "/hoehe-nachzahlung-arbeitgeber",
        userInput: { arbeitgeberNachzahlungHigherThan: "yes" },
      },
    ],
    einmalzahlungArbeitgeber: [
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
    ],
    sozialleistungen: [
      {
        stepId: "/sozialleistungen",
        userInput: { hasSozialleistungen: "buergergeld" },
      },
    ],
    sozialleistungNachzahlung: [
      {
        stepId: "/sozialleistung-nachzahlung",
        userInput: { hasSozialleistungNachzahlung: "yes" },
      },
    ],
    sozialleistungenEinmalzahlung: [
      {
        stepId: "/sozialleistungen-einmalzahlung",
        userInput: { hasSozialleistungenEinmalzahlung: "yes" },
      },
    ],
    kindergeld: [
      {
        stepId: "/kindergeld",
        userInput: { hasKindergeld: "yes" },
      },
    ],
    kindergeldNachzahlung: [
      {
        stepId: "/kindergeld-nachzahlung",
        userInput: { hasKindergeldNachzahlung: "yes" },
      },
    ],
    wohngeld: [
      {
        stepId: "/wohngeld",
        userInput: {
          hasWohngeld: "yes",
        },
      },
    ],
    wohngeldEmpfaenger: [
      {
        stepId: "/wohngeld-empfaenger",
        userInput: { wohngeld: "selbst" },
      },
    ],
    wohngeldNachzahlung: [
      {
        stepId: "/wohngeld-nachzahlung",
        userInput: { hasWohngeldNachzahlung: "yes" },
      },
    ],
    pflegegeld: [
      {
        stepId: "/pflegegeld",
        userInput: { hasPflegegeld: "yes" },
      },
    ],
    rente: [
      {
        stepId: "/rente",
        userInput: { hasRente: "yes" },
      },
    ],
    ergebnisNaechsteSchritte: [{ stepId: "/ergebnis/naechste-schritte" }],
  },
} satisfies FlowTestCases;
