import {
  compileFlow,
  CompiledFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import {
  PageConfigMap,
  TransitionConfigMap,
} from "~/services/flow/newFlowEngine/types";
import { pkhFormularAntragstellendePersonPages } from "./pages";
import {
  empfaengerIsChild,
  empfaengerIsAnderePerson,
  couldLiveFromUnterhalt,
  unterhaltBekommeIch,
} from "./guards";
import { vereinfachteErklaerungFlowConfig } from "./vereinfachteErklaerung/flowConfig";

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
    {
      target: null,
    },
  ],
  unterhaltLebenFrage: [
    {
      guard: (data) => couldLiveFromUnterhalt({ context: data }),
      target: "unterhaltspflichtigePersonBeziehung",
    },
    {
      target: null,
    },
  ],
  unterhaltspflichtigePersonBeziehung: "warumKeinerUnterhalt",
  warumKeinerUnterhalt: null,
  unterhalt: "unterhaltHauptsaechlichesLeben",
  unterhaltsbeschreibung: null,
  unterhaltHauptsaechlichesLeben: [
    {
      guard: (data) => unterhaltBekommeIch({ context: data }),
      target: "unterhaltspflichtigePerson",
    },
    {
      target: null,
    },
  ],
  unterhaltspflichtigePerson: "eigenesExemplar",
  eigenesExemplar: null,
  zweiFormulare: null,
} satisfies Partial<
  TransitionConfigMap<typeof pkhFormularAntragstellendePersonPages>
>;
