import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import type { FluggastrechteFormularPages } from "../pages";

export const grundvoraussetzungenFlowConfig = {
  grundvoraussetzungenStreitbeilegung: [
    {
      target: "grundvoraussetzungenStreitbeilegungGruende",
      guard: ({ streitbeilegung }) => streitbeilegung === "no",
    },
    { target: "grundvorraussetzungenProzessfaehig" },
  ],
  grundvoraussetzungenStreitbeilegungGruende:
    "grundvorraussetzungenProzessfaehig",
  grundvorraussetzungenProzessfaehig: "grundvoraussetzungenAusgleichszahlung",
  grundvoraussetzungenAusgleichszahlung: "grundvoraussetzungenDatenUebernahme",
  grundvoraussetzungenDatenUebernahme: "grundvoraussetzungenAmtsgericht",
  grundvoraussetzungenAmtsgericht: [
    {
      target: "streitwertKostenGerichtskosten",
      guard: ({ pageData }) =>
        pageData?.subflowDoneStates?.["/grundvoraussetzungen"] === true,
    },
  ],
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
