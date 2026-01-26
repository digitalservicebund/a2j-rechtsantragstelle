import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../userData";
import { geldEinklagenKlageErstellenPages } from "../pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { hasOptionalString } from "~/domains/guards.server";

const steps = xStateTargetsFromPagesConfig(geldEinklagenKlageErstellenPages);

export const rechtlicherZusatzXstateConfig = {
  id: "rechtlicher-zusatz",
  initial: "weitere-antraege",
  states: {
    [steps.rechtlicherZusatzWeitereAntraege.relative]: {
      on: {
        SUBMIT: steps.rechtlicherZusatzRechtlicheWuerdigung.relative,
        BACK: steps.prozessfuehrungZahlungNachKlageeinreichung.absolute,
      },
    },
    [steps.rechtlicherZusatzRechtlicheWuerdigung.relative]: {
      on: {
        SUBMIT: {
          guard: ({ context }) =>
            hasOptionalString(context.weitereAntraege) &&
            hasOptionalString(context.rechtlicheWuerdigung),
          target: "#klage-herunterladen.intro.start",
        },
        BACK: steps.rechtlicherZusatzWeitereAntraege.relative,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularKlageErstellenUserData>;
