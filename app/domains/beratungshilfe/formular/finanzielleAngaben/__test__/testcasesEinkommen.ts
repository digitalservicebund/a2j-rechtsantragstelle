import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { reachRechtsproblem } from "~/domains/beratungshilfe/formular/__test__/reachData";

const finanzielleAngabenStart = "/finanzielle-angaben/einkommen/start";
const finanzielleAngabenEinkommenStaatlicheLeistungen =
  "/finanzielle-angaben/einkommen/staatliche-leistungen";
const persoenlicheDatenStart = "/persoenliche-daten/start";

export const testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen = {
  receivesAsylbewerberleistungen: [
    {
      stepId: "/rechtsproblem/situation-beschreibung",
      userInput: {
        ...reachRechtsproblem,
        gegenseite: "gegenseite",
        beschreibung: "beschreibung",
        ziel: "ziel",
        eigeninitiativeBeschreibung: "eigeninitiative",
      },
    },
    {
      stepId: finanzielleAngabenStart,
    },
    {
      stepId: finanzielleAngabenEinkommenStaatlicheLeistungen,
      userInput: {
        ...reachRechtsproblem,
        staatlicheLeistungen: "asylbewerberleistungen",
      },
    },
    { stepId: persoenlicheDatenStart },
  ],
  receivesBuergergeld: [
    {
      stepId: finanzielleAngabenEinkommenStaatlicheLeistungen,
      userInput: {
        ...reachRechtsproblem,
        staatlicheLeistungen: "buergergeld",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
      userInput: {
        hasBankkonto: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        hasGeldanlage: "no",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage",
      userInput: {
        hasKraftfahrzeug: "no",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
      userInput: {
        hasWertsache: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
      userInput: {
        hasGrundeigentum: "no",
      },
    },
    {
      stepId: persoenlicheDatenStart,
    },
  ],
  receivesGrundsicherung: [
    {
      stepId: finanzielleAngabenEinkommenStaatlicheLeistungen,
      userInput: {
        ...reachRechtsproblem,
        staatlicheLeistungen: "grundsicherung",
      },
    },
    {
      stepId: persoenlicheDatenStart,
    },
  ],
  noStaatlicheLeistungEwerbstaetig: [
    {
      stepId: finanzielleAngabenEinkommenStaatlicheLeistungen,
      userInput: {
        ...reachRechtsproblem,
        staatlicheLeistungen: "keine",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/erwerbstaetig",
      userInput: {
        erwerbstaetig: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/art",
      userInput: {
        berufart: "selbststaendig",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/situation",
      userInput: {
        berufsituation: "no",
      },
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
      userInput: {
        einkommen: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
    },
  ],
  noStaatlicheLeistungNotEwerbstaetig: [
    {
      stepId: finanzielleAngabenEinkommenStaatlicheLeistungen,
      userInput: {
        ...reachRechtsproblem,
        staatlicheLeistungen: "keine",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/erwerbstaetig",
      userInput: {
        erwerbstaetig: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/situation",
    },
  ],
} satisfies FlowTestCases<BeratungshilfeFormularUserData>;
