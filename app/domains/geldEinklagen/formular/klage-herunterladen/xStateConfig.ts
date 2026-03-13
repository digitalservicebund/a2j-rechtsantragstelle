import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularUserData } from "../userData";
import { geldEinklagenKlageHerunterladenPages } from "./pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const steps = xStateTargetsFromPagesConfig(
  geldEinklagenKlageHerunterladenPages,
);

export const klageHerunterladenXstateConfig = {
  id: "klage-herunterladen",
  initial: "intro",
  states: {
    intro: {
      id: "intro",
      initial: "start",
      states: {
        [steps.klageHerunterladenIntroStart.relative]: {
          always: [
            {
              guard: ({ context }) => context.anwaltschaft === "yes",
              target: steps.klageHerunterladenIntroStartAnwaltschaft.relative,
            },
            steps.klageHerunterladenIntroStart.relative,
          ],
          on: {
            BACK: "#klage-erstellen.zusammenfassung.uebersicht",
          },
        },
        [steps.klageHerunterladenIntroStartAnwaltschaft.relative]: {
          on: {
            BACK: "#klage-erstellen.zusammenfassung.uebersicht",
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularUserData>;
