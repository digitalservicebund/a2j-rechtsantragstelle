import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenKlageErstellenPages } from "../pages";
import type { Config } from "~/services/flow/server/types";
import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularUserData } from "../../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type GeldEinklagenDaten = GenericGuard<GeldEinklagenFormularUserData>;

// Move later to subflowDoneStates, when fix issue related isDone value true when is not reachable
const hasFilledKlagendePerson: GeldEinklagenDaten = ({ context }) => {
  const hasFilledKlagendePersonAnwaltschaftData = objectKeysNonEmpty(context, [
    "klagendePersonAnwaltschaftAnrede",
    "klagendePersonAnwaltschaftVorname",
    "klagendePersonAnwaltschaftNachname",
    "klagendePersonAnwaltschaftStrasseHausnummer",
    "klagendePersonAnwaltschaftPlz",
    "klagendePersonAnwaltschaftOrt",
  ]);

  const hasFilledKlagendePersonKontaktdaten = objectKeysNonEmpty(context, [
    "klagendePersonAnrede",
    "klagendePersonVorname",
    "klagendePersonNachname",
    "klagendePersonStrasseHausnummer",
    "klagendePersonPlz",
    "klagendePersonOrt",
  ]);

  return (
    hasFilledKlagendePersonKontaktdaten &&
    ((context.anwaltschaft === "yes" &&
      hasFilledKlagendePersonAnwaltschaftData) ||
      context.anwaltschaft === "no")
  );
};

const steps = xStateTargetsFromPagesConfig(geldEinklagenKlageErstellenPages);

export const klagendePersonXstateConfig = {
  id: "klagende-person",
  initial: "kontaktdaten-anwaltschaft",
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
} satisfies Config<GeldEinklagenFormularUserData>;
