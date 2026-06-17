import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenGerichtPruefenPages } from "../pages";

export const gerichtPruefenSachgebietFlowConfig = {
  sachgebietInfo: "sachgebietAusgeschlossen",
  sachgebietAusgeschlossen: [
    {
      guard: (context) => context.ausgeschlossen === "yes",
      target: "sachgebietAbbruch",
    },
    {
      target: "sachgebietBesondere",
    },
  ],
  sachgebietAbbruch: null,
  sachgebietBesondere: [
    {
      guard: (context) =>
        context.sachgebiet === "schaden" ||
        context.sachgebiet === "anderesRechtsproblem" ||
        context.sachgebiet === "urheberrecht",
      target: "klagendePersonFuerWen",
    },
    {
      guard: (context) => context.sachgebiet === "miete",
      target: "sachgebietMietePachtVertrag",
    },
    {
      guard: (context) => context.sachgebiet === "versicherung",
      target: "sachgebietVersicherungVertrag",
    },
    {
      guard: (context) => context.sachgebiet === "reisen",
      target: "sachgebietReiseArt",
    },
    {
      guard: (context) => context.sachgebiet === "verkehrsunfall",
      target: "sachgebietVerkehrsunfallStrassenverkehr",
    },
  ],
  sachgebietMietePachtVertrag: [
    {
      guard: (context) => context.mietePachtVertrag === "yes",
      target: "sachgebietMietePachtRaum",
    },
    {
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietMietePachtRaum: "klagendePersonFuerWen",
  sachgebietVersicherungVertrag: [
    {
      guard: (context) => context.versicherungVertrag === "yes",
      target: "sachgebietVersicherungVersicherungsnehmer",
    },
    {
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietVersicherungVersicherungsnehmer: "klagendePersonFuerWen",
  sachgebietReiseArt: [
    {
      guard: (context) => context.reiseArt === "flug",
      target: "sachgebietReiseInfoFlug",
    },
    {
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietReiseInfoFlug: "klagendePersonFuerWen",
  sachgebietVerkehrsunfallStrassenverkehr: "klagendePersonFuerWen",
} satisfies Partial<TransitionConfigMap<GeldEinklagenGerichtPruefenPages>>;
