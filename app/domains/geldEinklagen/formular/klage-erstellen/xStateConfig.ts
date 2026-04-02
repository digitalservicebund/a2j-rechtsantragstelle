import { type Config } from "~/services/flow/server/types";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenKlageErstellenPages } from "./pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { prozessfuehrungXstateConfig } from "~/domains/geldEinklagen/formular/klage-erstellen/prozessfuehrung/xStateConfig";
import { rechtlicherZusatzXstateConfig } from "./rechtlicher-zusatz/xStateConfig";
import { klagendePersonXstateConfig } from "./klagende-person/xStateConfig";
import { type GeldEinklagenFormularUserData } from "../userData";
import { type GenericGuard } from "~/domains/guards.server";

const steps = xStateTargetsFromPagesConfig(geldEinklagenKlageErstellenPages);

type GeldEinklagenDaten = GenericGuard<GeldEinklagenFormularUserData>;

const isBeklagtePersonDone: GeldEinklagenDaten = ({ context }) => {
  return (
    context.pageData?.subflowDoneStates?.[
      "/klage-erstellen/beklagte-person"
    ] === true
  );
};

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
            SUBMIT: [
              {
                guard: ({ context }) => context.anwaltschaft === "yes",
                target: steps.klagendePersonAnwaltschaft.absolute,
              },
              steps.klagendePersonKontaktdaten.absolute,
            ],
            BACK: steps.streitWertKostenGerichtskostenvorschuss.relative,
          },
        },
      },
    },
    "klagende-person": klagendePersonXstateConfig,
    "beklagte-person": {
      id: "beklagte-person",
      initial: "mensch",
      states: {
        [steps.beklagtePersonMenschen.relative]: {
          always: [
            {
              guard: ({ context }) => context.gegenWenBeklagen === "person",
              target: steps.beklagtePersonMenschen.relative,
            },
            steps.beklagtePersonOrganisation.relative,
          ],
          on: {
            BACK: steps.klagendePersonKontaktdaten.absolute,
            SUBMIT: {
              guard: isBeklagtePersonDone,
              target: steps.forderungGesamtbetrag.absolute,
            },
          },
        },
        [steps.beklagtePersonOrganisation.relative]: {
          on: {
            SUBMIT: {
              guard: isBeklagtePersonDone,
              target: steps.forderungGesamtbetrag.absolute,
            },
            BACK: steps.klagendePersonKontaktdaten.absolute,
          },
        },
      },
    },
    forderung: {
      id: "forderung",
      initial: "gesamtbetrag",
      states: {
        [steps.forderungGesamtbetrag.relative]: {
          on: {
            SUBMIT: {
              guard: ({ context }) =>
                objectKeysNonEmpty(context, ["forderungGesamtbetrag"]),
              target: steps.sachverhaltBegruendung.absolute,
            },
            BACK: [
              {
                guard: ({ context }) => context.gegenWenBeklagen === "person",
                target: steps.beklagtePersonMenschen.absolute,
              },
              steps.beklagtePersonOrganisation.absolute,
            ],
          },
        },
      },
    },
    sachverhalt: {
      id: "sachverhalt",
      initial: "begruendung",
      states: {
        [steps.sachverhaltBegruendung.relative]: {
          on: {
            SUBMIT: {
              guard: ({ context }) =>
                objectKeysNonEmpty(context, ["sachverhaltBegruendung"]),
              target: steps.beweiseAngebot.absolute,
            },
            BACK: steps.forderungGesamtbetrag.absolute,
          },
        },
      },
    },
    beweise: {
      id: "beweise",
      initial: "angebot",
      states: {
        [steps.beweiseAngebot.relative]: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => context.beweiseAngebot === "yes",
                target: steps.beweiseBeschreibung.relative,
              },
              {
                guard: ({ context }) => context.beweiseAngebot === "no",
                target: steps.prozessfuehrungAnwaltskosten.absolute,
              },
            ],
            BACK: steps.sachverhaltBegruendung.absolute,
          },
        },
        [steps.beweiseBeschreibung.relative]: {
          on: {
            SUBMIT: {
              guard: ({ context }) =>
                objectKeysNonEmpty(context, ["beweiseBeschreibung"]),
              target: steps.prozessfuehrungAnwaltskosten.absolute,
            },
            BACK: steps.beweiseAngebot.relative,
          },
        },
      },
    },
    prozessfuehrung: prozessfuehrungXstateConfig,
    "rechtlicher-zusatz": rechtlicherZusatzXstateConfig,
    zusammenfassung: {
      id: "zusammenfassung",
      initial: "uebersicht",
      states: {
        [steps.zusammenfassungUebersicht.relative]: {
          on: {
            SUBMIT: "#klage-herunterladen.intro.start",
            BACK: steps.rechtlicherZusatzRechtlicheWuerdigung.absolute,
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularUserData>;
