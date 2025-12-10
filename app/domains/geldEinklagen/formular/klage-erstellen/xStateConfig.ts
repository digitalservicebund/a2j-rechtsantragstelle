import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularKlageErstellenUserData } from "./userData";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenKlageErstellenPages } from "./pages";

const steps = xStateTargetsFromPagesConfig(geldEinklagenKlageErstellenPages);

export const klageErstellenXstateConfig = {
  id: "klage-erstellen",
  initial: "intro",
  states: {
    intro: {
      id: "intro",
      initial: "start",
      states: {
        [steps.klageErstellenIntroStart.relative]: {
          on: {
            SUBMIT: steps.streitWertKostenGerichtskostenvorschuss.absolute,
            BACK: "#gericht-pruefen.zustaendiges-gericht.pilot-gericht",
          },
        },
      },
    },
    "streitwert-kosten": {
      id: "streitwert-kosten",
      initial: "gerichtskostenvorschuss",
      states: {
        [steps.streitWertKostenGerichtskostenvorschuss.relative]: {
          on: {
            SUBMIT: steps.streitwertKostenWeitereKosten.relative,
            BACK: steps.klageErstellenIntroStart.absolute,
          },
        },
        [steps.streitwertKostenWeitereKosten.relative]: {
          on: {
            BACK: steps.streitWertKostenGerichtskostenvorschuss.relative,
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularKlageErstellenUserData>;
