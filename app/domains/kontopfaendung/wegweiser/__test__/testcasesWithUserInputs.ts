import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { kontopfaendungWegweiserXstateConfig } from "../xStateConfig";

const keineKontopfaendungTestCase = {
  //   stepId: "/ergebnis/keine-kontopfaendung",
  //   userInput: { hasKontopfaendung: "nein" },
  //   stepId: "/p-konto-probleme",
  //   userInput: { hasKontopfaendung: "ja", hasPKonto: "nichtAktiv" },
};

export const kontopfaendungWegweiserTestCases = {
  xstateConfig: kontopfaendungWegweiserXstateConfig,
  testcases: {
    fullFlow: [
      { stepId: "/start" },
      {
        stepId: "/kontopfaendung",
        userInput: { hasKontopfaendung: "ja" },
      },
      {
        stepId: "/p-konto",
        userInput: { hasPKonto: "ja" },
      },
      {
        stepId: "/zwischenseite-unterhalt",
      },
      { stepId: "/kinder", userInput: { hasKinder: "yes" } },
      {
        stepId: "/kinder-wohnen-zusammen",
        userInput: { kinderWohnenZusammen: "nein" },
      },
      {
        stepId: "/kinder-unterhalt",
        userInput: {
          kinderUnterhalt: "yes",
        },
      },
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
      {
        stepId: "/zwischenseite-einkuenfte",
      },
      { stepId: "/arbeit", userInput: { hasArbeit: "yes" } },
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
        userInput: { sozialleistungNachzahlungHigherThan: "yes" },
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
      //   {
      //     stepId: "/sozialleistungen",
      //     userInput: { hasArbeit: "no", hasSozialleistungen: "nein" },
      //   },
      //   {
      //     stepId: "/sozialleistung-nachzahlung",
      //     userInput: { hasSozialleistungen: "grundsicherungSozialhilfe" },
      //   },
      //   {
      //     stepId: "sozialleistungen-einmalzahlung",
      //     userInput: { hasSozialleistungNachzahlung: "yes", hasSozialleistungenEinmalzahlung: "yes" },
      //   },
      //   {
      //     stepId: "/kindergeld",
      //     userInput: { hasKinder: "yes" },
      //   },
      //   {
      //     stepId: "/kindergeld-nachzahlung",
      //     userInput: { hasKinder: "yes", kindergeld: "yes" },
      //   },
      //   {
      //     stepId: "/wohngeld",
      //     userInput: {
      //       hasWohngeld: "no",
      //       hasSozialleistungen: "grundsicherungSozialhilfe",
      //       hasSozialleistungNachzahlung: "yes",
      //       hasSozialleistungenEinmalzahlung: "no",
      //     },
      //   },
      //   {
      //     stepId: "/wohngeld-empfaenger",
      //     userInput: { hasWohngeld: "yes" },
      //   },
      //   {
      //     stepId: "/wohngeld-nachzahlung",
      //     userInput: { hasWohngeld: "yes", wohngeld: "selbst" },
      //   },
      //   {
      //     stepId: "/pflegegeld",
      //     userInput: { hasPflegegeld: "yes", hasWohngeld: "no" },
      //   },
      //   {
      //     stepId: "/rente",
      //     userInput: { hasPflegegeld: "yes" },
      //   },
      //   { stepId: "/ergebnis/naechste-schritte", userInput: { hasRente: "yes" } },
    ],
  },
} satisfies FlowTestCases;
