import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularUserData } from "../userData";

export const klageHerunterladenXstateConfig = {
  id: "klage-herunterladen",
  initial: "intro",
  states: {
    intro: {
      id: "intro",
      initial: "start",
      states: {
        start: {
          on: {
            BACK: "#klage-erstellen.zusammenfassung.uebersicht",
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularUserData>;
