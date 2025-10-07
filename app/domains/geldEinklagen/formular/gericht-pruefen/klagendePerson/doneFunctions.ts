import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

function checkReisenAnderesRechtsproblemUrheberrecht(
  context: GeldEinklagenFormularGerichtPruefenUserData,
) {
  const { klagendeVerbraucher, klagendeVertrag } = context;

  if (klagendeVerbraucher === "no") {
    return objectKeysNonEmpty(context, ["klagendeKaufmann"]);
  }

  return (
    klagendeVertrag === "no" ||
    (klagendeVertrag === "yes" &&
      objectKeysNonEmpty(context, ["klagendeHaustuergeschaeft"]))
  );
}

function checkVersicherung(
  context: GeldEinklagenFormularGerichtPruefenUserData,
) {
  const { klagendeVerbraucher, versicherungVertrag, versicherungsnummer } =
    context;

  if (klagendeVerbraucher === "no") {
    return objectKeysNonEmpty(context, ["klagendeKaufmann"]);
  }

  if (
    versicherungVertrag === "no" ||
    (versicherungVertrag === "yes" && versicherungsnummer === "yes")
  ) {
    return true;
  }

  return objectKeysNonEmpty(context, ["klagendeHaustuergeschaeft"]);
}

function checkMiete(context: GeldEinklagenFormularGerichtPruefenUserData) {
  const { klagendeVerbraucher, mietePachtRaum, mietePachtVertrag } = context;

  if (klagendeVerbraucher === "no") {
    return (
      (mietePachtVertrag === "yes" && mietePachtRaum === "yes") ||
      objectKeysNonEmpty(context, ["klagendeKaufmann"])
    );
  }

  if (
    mietePachtVertrag === "no" ||
    (mietePachtVertrag === "yes" && mietePachtRaum === "yes")
  ) {
    return true;
  }

  return objectKeysNonEmpty(context, ["klagendeHaustuergeschaeft"]);
}

function checkBesondereForKlagendePerson(
  context: GeldEinklagenFormularGerichtPruefenUserData,
) {
  const { besondere } = context;
  switch (besondere) {
    case "verkehrsunfall":
    case "schaden": {
      return objectKeysNonEmpty(context, ["klagendeKaufmann"]);
    }
    case "miete": {
      return (
        objectKeysNonEmpty(context, ["klagendeVerbraucher"]) &&
        checkMiete(context)
      );
    }
    case "versicherung": {
      return (
        objectKeysNonEmpty(context, ["klagendeVerbraucher"]) &&
        checkVersicherung(context)
      );
    }
    case "reisen":
    case "anderesRechtsproblem":
    case "urheberrecht": {
      return (
        objectKeysNonEmpty(context, ["klagendeVerbraucher"]) &&
        checkReisenAnderesRechtsproblemUrheberrecht(context)
      );
    }
    case undefined:
    default: {
      return false;
    }
  }
}

export const klagendePersonDone: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  return (
    objectKeysNonEmpty(context, ["fuerWenKlagen"]) &&
    checkBesondereForKlagendePerson(context)
  );
};
