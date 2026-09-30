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
      guard: (context) => context.unterhaltsanspruch === "anspruchNoUnterhalt",
      target: "unterhaltLebenFrage",
    },
    {
      guard: (context) => context.unterhaltsanspruch === "unterhalt",
      target: "unterhalt",
    },
    {
      guard: (context) => context.unterhaltsanspruch === "sonstiges",
      target: "unterhaltsbeschreibung",
    },
    {
      guard: (context) => isNachueberpruefung({ context }),
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
      guard: (context) => isNachueberpruefung({ context }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  unterhaltspflichtigePersonBeziehung: "warumKeinerUnterhalt",
  warumKeinerUnterhalt: [
    {
      guard: (context) => isNachueberpruefung({ context }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  unterhalt: "unterhaltHauptsaechlichesLeben",
  unterhaltsbeschreibung: [
    {
      guard: (context) => isNachueberpruefung({ context }),
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
      guard: (context) => isNachueberpruefung({ context }),
      target: "einkuenfteStart",
    },
    {
      target: "rsvFrage",
    },
  ],
  unterhaltspflichtigePerson: "eigenesExemplar",
  eigenesExemplar: [
    {
      guard: (context) => isNachueberpruefung({ context }),
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
