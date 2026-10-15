import { type GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { type GeldEinklagenFormularUserData } from "../../userData";

type GeldEinklagenDaten = GenericGuard<GeldEinklagenFormularUserData>;

export const hasFilledKlagendePerson: GeldEinklagenDaten = ({ context }) => {
  const hasFilledKlagendePersonAnwaltschaftData = objectKeysNonEmpty(context, [
    "klagendePersonAnwaltschaftVorname",
    "klagendePersonAnwaltschaftNachname",
    "klagendePersonAnwaltschaftStrasse",
    "klagendePersonAnwaltschaftHausnummer",
    "klagendePersonAnwaltschaftPlz",
    "klagendePersonAnwaltschaftOrt",
  ]);

  const hasFilledKlagendePersonKontaktdaten = objectKeysNonEmpty(context, [
    "klagendePersonVorname",
    "klagendePersonNachname",
    "klagendePersonStrasse",
    "klagendePersonHausnummer",
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
