import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

function checkKaufmann(context: GeldEinklagenFormularGerichtPruefenUserData) {
  const { klagendeKaufmann, beklagtePersonKaufmann } = context;

  if (klagendeKaufmann === "yes") {
    return (
      objectKeysNonEmpty(context, ["beklagtePersonKaufmann"]) &&
      (beklagtePersonKaufmann !== "yes" ||
        objectKeysNonEmpty(context, ["gerichtsstandsvereinbarung"]))
    );
  }

  return true;
}

function checkSachgebiet(context: GeldEinklagenFormularGerichtPruefenUserData) {
  const { sachgebiet, gegenWenBeklagen, mietePachtRaum } = context;
  switch (sachgebiet) {
    case "urheberrecht": {
      return (
        ((gegenWenBeklagen === "person" &&
          objectKeysNonEmpty(context, ["beklagtePersonGeldVerdienen"])) ||
          gegenWenBeklagen === "organisation") &&
        checkKaufmann(context)
      );
    }
    case "miete": {
      return mietePachtRaum === "yes" || checkKaufmann(context);
    }
    case "versicherung":
    case "reisen":
    case "anderesRechtsproblem":
    case "schaden":
    case "verkehrsunfall": {
      return checkKaufmann(context);
    }
    case undefined:
    default: {
      return false;
    }
  }
}

export const beklagtePersonDone: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  return (
    objectKeysNonEmpty(context, ["gegenWenBeklagen"]) &&
    checkSachgebiet(context)
  );
};
