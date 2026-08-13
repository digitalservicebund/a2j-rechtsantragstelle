import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenGerichtPruefenPages } from "../pages";
import { type GeldEinklagenFormularUserData } from "../../userData";

const isSachgebietDone = (context: GeldEinklagenFormularUserData) => {
  return (
    context.pageData?.subflowDoneStates?.["/gericht-pruefen/sachgebiet"] ===
    true
  );
};

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
      guard: (context) => isSachgebietDone(context),
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietMietePachtRaum: [
    {
      guard: (context) => isSachgebietDone(context),
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietVersicherungVertrag: [
    {
      guard: (context) => context.versicherungVertrag === "yes",
      target: "sachgebietVersicherungVersicherungsnehmer",
    },
    {
      guard: (context) => isSachgebietDone(context),
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietVersicherungVersicherungsnehmer: [
    {
      guard: (context) => isSachgebietDone(context),
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietReiseArt: [
    {
      guard: (context) => context.reiseArt === "flug",
      target: "sachgebietReiseInfoFlug",
    },
    {
      guard: (context) => isSachgebietDone(context),
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietReiseInfoFlug: [
    {
      guard: (context) => isSachgebietDone(context),
      target: "klagendePersonFuerWen",
    },
  ],
  sachgebietVerkehrsunfallStrassenverkehr: [
    {
      guard: (context) => isSachgebietDone(context),
      target: "klagendePersonFuerWen",
    },
  ],
} satisfies Partial<TransitionConfigMap<GeldEinklagenGerichtPruefenPages>>;
