import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenGerichtPruefenPages } from "../pages";
import { isSachgebietDone } from "../../subflowDoneGuards";

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
        (context.sachgebiet === "schaden" ||
          context.sachgebiet === "anderesRechtsproblem" ||
          context.sachgebiet === "urheberrecht") &&
        isSachgebietDone(context),
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
      guard: isSachgebietDone,
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietMietePachtRaum: [
    {
      guard: isSachgebietDone,
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietVersicherungVertrag: [
    {
      guard: (context) => context.versicherungVertrag === "yes",
      target: "sachgebietVersicherungVersicherungsnehmer",
    },
    {
      guard: isSachgebietDone,
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietVersicherungVersicherungsnehmer: [
    {
      guard: isSachgebietDone,
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietReiseArt: [
    {
      guard: (context) => context.reiseArt === "flug",
      target: "sachgebietReiseInfoFlug",
    },
    {
      guard: isSachgebietDone,
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietReiseInfoFlug: [
    {
      guard: isSachgebietDone,
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietVerkehrsunfallStrassenverkehr: [
    {
      guard: isSachgebietDone,
      target: "klagendePersonFuerWen",
    },
  ],
} satisfies Partial<TransitionConfigMap<GeldEinklagenGerichtPruefenPages>>;
