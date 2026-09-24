import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { vereinfachteErklaerungFlowConfig } from "./vereinfachteErklaerung/flowConfig";
import { type prozesskostenhilfeFormularPages } from "../pages";
import { isNachueberpruefung } from "../grundvoraussetzungen/guards";

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
    {
      guard: (data) => isNachueberpruefung({ context: data }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  unterhaltLebenFrage: [
    {
      guard: (context) => context.couldLiveFromUnterhalt === "yes",
      target: "unterhaltspflichtigePersonBeziehung",
    },
    {
      guard: (data) => isNachueberpruefung({ context: data }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  unterhaltspflichtigePersonBeziehung: "warumKeinerUnterhalt",
  warumKeinerUnterhalt: [
    {
      guard: (data) => isNachueberpruefung({ context: data }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  unterhalt: "unterhaltHauptsaechlichesLeben",
  unterhaltsbeschreibung: [
    {
      guard: (data) => isNachueberpruefung({ context: data }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  unterhaltHauptsaechlichesLeben: [
    {
      guard: (context) => context.livesPrimarilyFromUnterhalt === "yes",
      target: "unterhaltspflichtigePerson",
    },
    {
      guard: (data) => isNachueberpruefung({ context: data }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  unterhaltspflichtigePerson: "eigenesExemplar",
  eigenesExemplar: [
    {
      guard: (data) => isNachueberpruefung({ context: data }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  zweiFormulare: "einkuenfteStart",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
