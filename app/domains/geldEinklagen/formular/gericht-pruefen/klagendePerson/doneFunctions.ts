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

function checkMiete(context: GeldEinklagenFormularGerichtPruefenUserData) {
  const { klagendeVerbraucher, mietePachtRaum, mietePachtVertrag } = context;

  if (mietePachtVertrag === "yes" && mietePachtRaum === "yes") {
    return true;
  }

  return (
    (klagendeVerbraucher === "no" &&
      objectKeysNonEmpty(context, ["klagendeKaufmann"])) ||
    (klagendeVerbraucher === "yes" &&
      objectKeysNonEmpty(context, ["klagendeHaustuergeschaeft"]))
  );
}

function checkSachgebietForKlagendePerson(
  context: GeldEinklagenFormularGerichtPruefenUserData,
) {
  const { sachgebiet } = context;
  switch (sachgebiet) {
    case "verkehrsunfall":
    case "schaden":
    case "versicherung": {
      return objectKeysNonEmpty(context, ["klagendeKaufmann"]);
    }
    case "miete": {
      return checkMiete(context);
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
    checkSachgebietForKlagendePerson(context)
  );
};
