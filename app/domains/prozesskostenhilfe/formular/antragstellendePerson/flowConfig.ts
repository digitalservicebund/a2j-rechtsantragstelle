import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { vereinfachteErklaerungFlowConfig } from "./vereinfachteErklaerung/flowConfig";
import { type prozesskostenhilfeFormularPages } from "../pages";
export const antragstellendePersonFlowConfig = {
  empfaenger: [
    {
      guard: (context) => context.empfaenger === "child",
      target: "kind",
    },
    {
      guard: (context) => context.empfaenger === "otherPerson",
      target: "zweiFormulare",
    },
    {
      target: "unterhaltsanspruch",
    },
  ],
  ...vereinfachteErklaerungFlowConfig,
  unterhaltsanspruch: [
    {
      guard: (data) => data.unterhaltsanspruch === "anspruchNoUnterhalt",
      target: "unterhaltLebenFrage",
    },
    {
      guard: (data) => data.unterhaltsanspruch === "unterhalt",
      target: "unterhalt",
    },
    {
      guard: (data) => data.unterhaltsanspruch === "sonstiges",
      target: "unterhaltsbeschreibung",
    },
    { target: "rsvFrage" },
  ],
  unterhaltLebenFrage: [
    {
      guard: (context) => context.couldLiveFromUnterhalt === "yes",
      target: "unterhaltspflichtigePersonBeziehung",
    },
    { target: "rsvFrage" },
  ],
  unterhaltspflichtigePersonBeziehung: "warumKeinerUnterhalt",
  warumKeinerUnterhalt: "rsvFrage",
  unterhalt: "unterhaltHauptsaechlichesLeben",
  unterhaltsbeschreibung: "rsvFrage",
  unterhaltHauptsaechlichesLeben: [
    {
      guard: (context) => context.livesPrimarilyFromUnterhalt === "yes",
      target: "unterhaltspflichtigePerson",
    },
    { target: "rsvFrage" },
  ],
  unterhaltspflichtigePerson: "eigenesExemplar",
  eigenesExemplar: "rsvFrage",
  zweiFormulare: "einkuenfteStart",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
