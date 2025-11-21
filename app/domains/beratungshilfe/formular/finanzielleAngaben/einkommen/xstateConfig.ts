import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { berhAntragFinanzielleAngabenEinkommenPages } from "./pages";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./userData";
import {
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
} from "../guards";

const steps = xStateTargetsFromPagesConfig(
  berhAntragFinanzielleAngabenEinkommenPages,
);

export const beratungshilfeFinanzielleAngabenEinkommenXstateConfig = {
  id: "einkommen",
  initial: steps.einkommenStart.relative,
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
            guard: staatlicheLeistungenIsBuergergeld,
            target: "#eigentum.eigentum-info",
          },
          {
            guard: staatlicheLeistungenIsKeine,
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
            guard: ({ context }) => context.erwerbstaetig === "yes",
            target: steps.berufart.relative,
          },
          steps.situation.relative,
        ],
      },
    },
    [steps.berufart.relative]: {
      on: {
        BACK: steps.erwerbstaetig.relative,
        SUBMIT: steps.situation.relative,
      },
    },
    [steps.situation.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.erwerbstaetig === "yes",
            target: steps.berufart.relative,
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
