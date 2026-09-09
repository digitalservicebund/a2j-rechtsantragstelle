import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import {
  empfaengerIsChild,
  empfaengerIsAnderePerson,
  couldLiveFromUnterhalt,
  unterhaltBekommeIch,
} from "./guards";
import { vereinfachteErklaerungFlowConfig } from "./vereinfachteErklaerung/flowConfig";
import { prozesskostenhilfeFormularPages } from "../pages";
export const antragstellendePersonFlowConfig = {
  empfaenger: [
    {
      guard: (data) => empfaengerIsChild({ context: data }),
      target: "kind",
    },
    {
      guard: (data) => empfaengerIsAnderePerson({ context: data }),
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
      guard: (data) => couldLiveFromUnterhalt({ context: data }),
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
      guard: (data) => unterhaltBekommeIch({ context: data }),
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
