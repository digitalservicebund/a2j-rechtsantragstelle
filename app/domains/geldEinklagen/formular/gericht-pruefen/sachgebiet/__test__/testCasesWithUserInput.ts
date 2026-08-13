import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/sachgebiet": true,
    },
  },
};

export const testCasesWithUserInputSachgebiet: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    yesAusgeschlossen: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "yes" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ergebnis/sachgebiet-abbruch",
      },
    ],
    sachgebietAnderesRechtsproblem: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "anderesRechtsproblem" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietUrheberrecht: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "urheberrecht" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietSchaden: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "schaden" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietMieteWithVertragAndRaumYes: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "miete" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/miete-pacht-vertrag",
        userInput: { mietePachtVertrag: "yes" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/miete-pacht-raum",
        userInput: { mietePachtRaum: "yes" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietMieteWithVertragAndRaumNo: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "miete" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/miete-pacht-vertrag",
        userInput: { mietePachtVertrag: "yes" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/miete-pacht-raum",
        userInput: { mietePachtRaum: "no" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietMieteWithNoVertrag: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "miete" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/miete-pacht-vertrag",
        userInput: { mietePachtVertrag: "no" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietVersicherungWithVertragAndRaumYes: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "versicherung" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/versicherung-vertrag",
        userInput: { versicherungVertrag: "yes" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/versicherung-versicherungsnehmer",
        userInput: { versicherungsnehmer: "yes" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietVersicherungWithVertragAndRaumNo: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "versicherung" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/versicherung-vertrag",
        userInput: { versicherungVertrag: "yes" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/versicherung-versicherungsnehmer",
        userInput: { versicherungsnehmer: "no" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietVersicherungWithNoVertrag: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "versicherung" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/versicherung-vertrag",
        userInput: { versicherungVertrag: "no" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietReisenWithAndereReisen: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "reisen" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/reise-art",
        userInput: { reiseArt: "andereReise" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietReisenWithFlug: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "reisen" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/reise-art",
        userInput: { reiseArt: "flug" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ergebnis/reise-flug",
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietVerkehrsunfallWithVerkehrsunfallStrassenverkehrYes: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "verkehrsunfall" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/verkehrsunfall-strassenverkehr",
        userInput: { verkehrsunfallStrassenverkehr: "yes" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
    sachgebietVerkehrsunfallWithVerkehrsunfallStrassenverkehrNo: [
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
        userInput: { ...baseContext },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/ausgeschlossen",
        userInput: { ausgeschlossen: "no" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/besondere",
        userInput: { sachgebiet: "verkehrsunfall" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/verkehrsunfall-strassenverkehr",
        userInput: { verkehrsunfallStrassenverkehr: "no" },
      },
      {
        stepId: "/gericht-pruefen/klagende-person/fuer-wen",
      },
    ],
  };
