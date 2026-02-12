import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularKlageErstellenUserData } from "./userData";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenKlageErstellenPages } from "./pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { type GenericGuard } from "~/domains/guards.server";
import { prozessfuehrungXstateConfig } from "~/domains/geldEinklagen/formular/klage-erstellen/prozessfuehrung/xStateConfig";
import { rechtlicherZusatzXstateConfig } from "./rechtlicher-zusatz/xStateConfig";

const steps = xStateTargetsFromPagesConfig(geldEinklagenKlageErstellenPages);

type GeldEinklagenKlageErstellenDaten =
  GenericGuard<GeldEinklagenFormularKlageErstellenUserData>;

const hasFilledKlagendePerson: GeldEinklagenKlageErstellenDaten = ({
  context,
}) => {
  return objectKeysNonEmpty(context, [
    "klagendePersonAnrede",
    "klagendePersonVorname",
    "klagendePersonNachname",
    "klagendePersonStrasseHausnummer",
    "klagendePersonPlz",
    "klagendePersonOrt",
  ]);
};

const isPerson: GeldEinklagenKlageErstellenDaten = ({ context }) =>
  context.gegenWenBeklagen === "person";

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
            SUBMIT: steps.klagendePersonKontaktdaten.absolute,
            BACK: steps.streitWertKostenGerichtskostenvorschuss.relative,
          },
        },
      },
    },
    "klagende-person": {
      id: "klagende-person",
      initial: "kontaktdaten",
      states: {
        [steps.klagendePersonKontaktdaten.relative]: {
          on: {
            BACK: steps.streitwertKostenWeitereKosten.absolute,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  isPerson({ context }) && hasFilledKlagendePerson({ context }),
                target: steps.beklagtePersonMenschen.absolute,
              },
              {
                guard: hasFilledKlagendePerson,
                target: steps.beklagtePersonOrganisation.absolute,
              },
            ],
          },
        },
      },
    },
    "beklagte-person": {
      id: "beklagte-person",
      initial: "mensch",
      states: {
        [steps.beklagtePersonMenschen.relative]: {
          always: [
            {
              guard: isPerson,
              target: steps.beklagtePersonMenschen.relative,
            },
            steps.beklagtePersonOrganisation.relative,
          ],
          on: {
            BACK: steps.klagendePersonKontaktdaten.absolute,
            SUBMIT: {
              guard: ({ context }) =>
                objectKeysNonEmpty(context, [
                  "beklagteNachname",
                  "beklagteVorname",
                  "beklagteStrasseHausnummer",
                  "beklagtePlz",
                  "beklagteOrt",
                ]),
              target: steps.forderungGesamtbetrag.absolute,
            },
          },
        },
        [steps.beklagtePersonOrganisation.relative]: {
          on: {
            SUBMIT: {
              guard: ({ context }) =>
                objectKeysNonEmpty(context, [
                  "beklagteNameOrganisation",
                  "beklagteStrasseHausnummer",
                  "beklagtePlz",
                  "beklagteOrt",
                ]),
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
            SUBMIT: steps.sachverhaltBegruendung.absolute,
            BACK: [
              {
                guard: isPerson,
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
            SUBMIT: steps.beweiseAngebot.absolute,
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
              steps.rechtsproblemIntoStart.absolute,
            ],
            BACK: steps.sachverhaltBegruendung.absolute,
          },
        },
        [steps.beweiseBeschreibung.relative]: {
          on: {
            SUBMIT: steps.rechtsproblemIntoStart.absolute,
            BACK: steps.beweiseAngebot.relative,
          },
        },
      },
    },
    rechtsproblem: {
      id: "rechtsproblem",
      initial: "intro",
      states: {
        intro: {
          id: "intro",
          initial: "start",
          meta: { shouldAppearAsMenuNavigation: true },
          states: {
            [steps.rechtsproblemIntoStart.relative]: {
              on: {
                SUBMIT: steps.prozessfuehrungProzesszinsen.absolute,
                BACK: [
                  {
                    guard: ({ context }) => context.beweiseAngebot === "yes",
                    target: steps.beweiseBeschreibung.absolute,
                  },
                  steps.beweiseAngebot.absolute,
                ],
              },
            },
          },
        },
      },
    },
    prozessfuehrung: prozessfuehrungXstateConfig,
    "rechtlicher-zusatz": rechtlicherZusatzXstateConfig,
  },
} satisfies Config<GeldEinklagenFormularKlageErstellenUserData>;
