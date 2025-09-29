import type { FlowTestCases } from "~/domains/__test__/TestCases";

export const testCasesBeratungshilfeFormularDefault = {
  receivesStaatlicheLeistung: [
    {
      stepId: "/start/start",
    },
    {
      stepId: "/grundvoraussetzungen/rechtsschutzversicherung",
      userInput: { rechtsschutzversicherung: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/wurde-verklagt",
      userInput: { wurdeVerklagt: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/klage-eingereicht",
      userInput: { klageEingereicht: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/hamburg-oder-bremen",
      userInput: { hamburgOderBremen: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/beratungshilfe-beantragt",
      userInput: { beratungshilfeBeantragt: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
      userInput: { eigeninitiativeGrundvorraussetzung: "no" },
    },
    {
      stepId: "/anwaltliche-vertretung/start",
      userInput: { anwaltskanzlei: "no" },
    },
    {
      stepId: "/rechtsproblem/start",
    },
    {
      stepId: "/rechtsproblem/bereich",
      userInput: { bereich: "work" },
    },
    {
      stepId: "/rechtsproblem/situation-beschreibung",
      userInput: {
        gegenseite: "abc",
        beschreibung: "abc",
        ziel: "abc",
        eigeninitiativeBeschreibung: "abc",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/start",
    },
    {
      stepId: "/finanzielle-angaben/einkommen/staatliche-leistungen",
      userInput: { staatlicheLeistungen: "asylbewerberleistungen" },
    },
    {
      stepId: "/persoenliche-daten/start",
    },
    {
      stepId: "/persoenliche-daten/name",
      userInput: { vorname: "Max", nachname: "Mustermann" },
    },
    {
      stepId: "/persoenliche-daten/geburtsdatum",
      userInput: { geburtsdatum: "01.01.2000" },
    },
    {
      stepId: "/persoenliche-daten/plz",
      userInput: { plz: "12437" },
    },
    {
      stepId: "/persoenliche-daten/adresse",
      userInput: {
        street: "Musterstraße",
        houseNumber: "1",
        ort: "Musterstadt",
      },
    },
    {
      stepId: "/persoenliche-daten/telefonnummer",
      userInput: { telefonnummer: "" },
    },
    {
      stepId: "/persoenliche-daten/nachbefragung",
    },
    {
      stepId: "/weitere-angaben",
      userInput: {
        weitereAngaben: "",
      },
    },
    {
      stepId: "/abgabe/zusammenfassung",
    },
  ],
  basicFlow: [
    {
      stepId: "/start/start",
    },
    {
      stepId: "/grundvoraussetzungen/rechtsschutzversicherung",
      userInput: { rechtsschutzversicherung: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/wurde-verklagt",
      userInput: { wurdeVerklagt: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/klage-eingereicht",
      userInput: { klageEingereicht: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/hamburg-oder-bremen",
      userInput: { hamburgOderBremen: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/beratungshilfe-beantragt",
      userInput: { beratungshilfeBeantragt: "no" },
    },
    {
      stepId: "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
      userInput: { eigeninitiativeGrundvorraussetzung: "no" },
    },
    {
      stepId: "/anwaltliche-vertretung/start",
      userInput: { anwaltskanzlei: "no" },
    },
    {
      stepId: "/rechtsproblem/start",
    },
    {
      stepId: "/rechtsproblem/bereich",
      userInput: { bereich: "work" },
    },
    {
      stepId: "/rechtsproblem/situation-beschreibung",
      userInput: {
        gegenseite: "abc",
        beschreibung: "abc",
        ziel: "abc",
        eigeninitiativeBeschreibung: "abc",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/start",
    },
    {
      stepId: "/finanzielle-angaben/einkommen/staatliche-leistungen",
      userInput: { staatlicheLeistungen: "keine" },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/erwerbstaetig",
      userInput: { erwerbstaetig: "no" },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/situation",
      userInput: { berufsituation: "no" },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/weiteres-einkommen",
      userInput: {
        weitereseinkommen: {
          unterhaltszahlungen: "off",
          arbeitlosengeld: "off",
          wohngeld: "off",
          kindergeld: "off",
          bafoeg: "off",
          krankengeld: "off",
          rente: "off",
          elterngeld: "off",
          insolvenzgeld: "off",
          ueberbrueckungsgeld: "off",
          others: "off",
          none: "on",
        },
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/einkommen",
      userInput: { einkommen: "100" },
    },
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
      userInput: { partnerschaft: "no" },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
      userInput: { hasKinder: "no" },
    },
    {
      stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      userInput: { hasWeitereUnterhaltszahlungen: "no" },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/wohnsituation",
      userInput: { livingSituation: "alone" },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/groesse",
      userInput: { apartmentSizeSqm: "55" },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/wohnkosten-allein",
      userInput: { apartmentCostAlone: "1000" },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
      userInput: { hasBankkonto: "no" },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: { hasGeldanlage: "no" },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage",
      userInput: { hasKraftfahrzeug: "no" },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
      userInput: { hasWertsache: "no" },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
      userInput: { hasGrundeigentum: "no" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben-frage",
      userInput: { hasAusgaben: "no" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/situation",
      userInput: {
        ausgabensituation: {
          pregnancy: "off",
          singleParent: "off",
          disability: "off",
          medicalReasons: "off",
          none: "on",
        },
      },
    },
    {
      stepId: "/persoenliche-daten/start",
    },
    {
      stepId: "/persoenliche-daten/name",
      userInput: { vorname: "Max", nachname: "Mustermann" },
    },
    {
      stepId: "/persoenliche-daten/geburtsdatum",
      userInput: { geburtsdatum: "01.01.2000" },
    },
    {
      stepId: "/persoenliche-daten/plz",
      userInput: { plz: "12437" },
    },
    {
      stepId: "/persoenliche-daten/adresse",
      userInput: {
        street: "Musterstraße",
        houseNumber: "1",
        ort: "Musterstadt",
      },
    },
    {
      stepId: "/persoenliche-daten/telefonnummer",
      userInput: { telefonnummer: "" },
    },
    {
      stepId: "/persoenliche-daten/nachbefragung",
    },
    {
      stepId: "/weitere-angaben",
      userInput: {
        weitereAngaben: "",
      },
    },
    {
      stepId: "/abgabe/zusammenfassung",
    },
  ],
} satisfies FlowTestCases["testcases"];
