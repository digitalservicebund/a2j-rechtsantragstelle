import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/buildFlowController";
import { berhAntragFinanzielleAngabenEinkommenPages } from "./pages";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./userData";
import { finanzielleAngabeGuards } from "../guards";
import { einkommenDone } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(
  berhAntragFinanzielleAngabenEinkommenPages,
);

export const beratungshilfeFinanzielleAngabenEinkommenXstateConfig = {
  id: "einkommen",
  initial: steps.einkommenStart.relative,
  meta: { done: einkommenDone },
  states: {
    [steps.einkommenStart.relative]: {
      on: {
        SUBMIT: steps.staatlicheLeistungen.relative,
      },
    },
    [steps.staatlicheLeistungen.relative]: {
      on: {
        SUBMIT: [
          {
            guard: finanzielleAngabeGuards.staatlicheLeistungenIsBuergergeld,
            target: "#eigentum.eigentum-info",
          },
          {
            guard: finanzielleAngabeGuards.staatlicheLeistungenIsKeine,
            target: steps.erwerbstaetig.relative,
          },
          "#persoenliche-daten.start",
        ],
        BACK: steps.einkommenStart.relative,
      },
    },
    [steps.erwerbstaetig.relative]: {
      on: {
        BACK: steps.staatlicheLeistungen.relative,
        SUBMIT: [
          {
            guard: finanzielleAngabeGuards.erwerbstaetigYes,
            target: steps.art.relative,
          },
          steps.situation.relative,
        ],
      },
    },
    [steps.art.relative]: {
      on: {
        BACK: steps.erwerbstaetig.relative,
        SUBMIT: steps.situation.relative,
      },
    },
    [steps.situation.relative]: {
      on: {
        BACK: [
          {
            guard: finanzielleAngabeGuards.erwerbstaetigYes,
            target: steps.art.relative,
          },
          steps.erwerbstaetig.relative,
        ],
        SUBMIT: steps.weiteresEinkommen.relative,
      },
    },
    [steps.weiteresEinkommen.relative]: {
      on: {
        SUBMIT: steps.einkommen.relative,
        BACK: steps.situation.relative,
      },
    },
    [steps.einkommen.relative]: {
      on: {
        BACK: steps.weiteresEinkommen.relative,
        SUBMIT: "#partner.partnerschaft",
      },
    },
  },
} satisfies Config<BeratungshilfeFinanzielleAngabenEinkommenUserData>;
