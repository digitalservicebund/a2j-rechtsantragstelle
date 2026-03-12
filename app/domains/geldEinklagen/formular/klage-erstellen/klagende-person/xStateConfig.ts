import type { GeldEinklagenFormularKlageErstellenUserData } from "~/domains/geldEinklagen/formular/klage-erstellen/userData";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenKlageErstellenPages } from "../pages";
import type { Config } from "~/services/flow/server/types";
import { type GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

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

const steps = xStateTargetsFromPagesConfig(geldEinklagenKlageErstellenPages);

export const klagendePersonXstateConfig = {
  id: "klagende-person",
  initial: "anwaltschaft",
  states: {
    [steps.klagendePersonAnwaltschaft.relative]: {
      always: [
        {
          guard: ({ context }) => context.anwaltschaft === "yes",
          target: steps.klagendePersonAnwaltschaft.relative,
        },
        steps.klagendePersonKontaktdaten.relative,
      ],
      on: {
        BACK: steps.streitwertKostenWeitereKosten.absolute,
        SUBMIT: steps.klagendePersonKontaktdaten.relative,
      },
    },
    [steps.klagendePersonKontaktdaten.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.anwaltschaft === "yes",
            target: steps.klagendePersonAnwaltschaft.relative,
          },
          steps.streitwertKostenWeitereKosten.absolute,
        ],
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.gegenWenBeklagen === "person" &&
              hasFilledKlagendePerson({ context }),
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
} satisfies Config<GeldEinklagenFormularKlageErstellenUserData>;
