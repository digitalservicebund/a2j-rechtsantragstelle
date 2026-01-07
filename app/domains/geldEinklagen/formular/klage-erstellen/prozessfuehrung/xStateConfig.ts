import { geldEinklagenKlageErstellenPages } from "~/domains/geldEinklagen/formular/klage-erstellen/pages";
import type { GeldEinklagenFormularKlageErstellenUserData } from "~/domains/geldEinklagen/formular/klage-erstellen/userData";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/types";

const steps = xStateTargetsFromPagesConfig(geldEinklagenKlageErstellenPages);

export const prozessfuehrungXstateConfig = {
  id: "prozessfuehrung",
  initial: "prozesszinsen",
  states: {
    [steps.prozessfuehrungProzesszinsen.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungAnwaltskosten.relative,
        BACK: steps.rechtsproblemIntoStart.absolute,
      },
    },
    [steps.prozessfuehrungAnwaltskosten.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungStreitbeilegung.relative,
        BACK: steps.prozessfuehrungProzesszinsen.relative,
      },
    },
    [steps.prozessfuehrungStreitbeilegung.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.streitbeilegung === "yes",
            target: steps.prozessfuehrungMuendlicheVerhandlung.relative,
          },
          steps.prozessfuehrungStreitbeilegungGruende.relative,
        ],
        BACK: steps.prozessfuehrungAnwaltskosten.relative,
      },
    },
    [steps.prozessfuehrungStreitbeilegungGruende.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungMuendlicheVerhandlung.relative,
        BACK: steps.prozessfuehrungStreitbeilegung.relative,
      },
    },
    [steps.prozessfuehrungMuendlicheVerhandlung.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungVideoVerhandlung.relative,
        BACK: [
          {
            guard: ({ context }) => context.streitbeilegung === "yes",
            target: steps.prozessfuehrungStreitbeilegung.relative,
          },
          steps.prozessfuehrungStreitbeilegungGruende.relative,
        ],
      },
    },
    [steps.prozessfuehrungVideoVerhandlung.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungVersaeumnisurteil.relative,
        BACK: steps.prozessfuehrungMuendlicheVerhandlung.relative,
      },
    },
    [steps.prozessfuehrungVersaeumnisurteil.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungZahlungNachKlageeinreichung.relative,
        BACK: steps.prozessfuehrungVideoVerhandlung.relative,
      },
    },
    [steps.prozessfuehrungZahlungNachKlageeinreichung.relative]: {
      on: {
        SUBMIT: steps.rechtlicherZusatzWeitereAntraege.absolute,
        BACK: steps.prozessfuehrungVersaeumnisurteil.relative,
      },
    },
  },
} satisfies Config<GeldEinklagenFormularKlageErstellenUserData>;
