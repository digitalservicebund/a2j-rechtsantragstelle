import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

function checkKaufmann(context: GeldEinklagenFormularGerichtPruefenUserData) {
  const { klagendeKaufmann, beklagtePersonKaufmann } = context;

  if (klagendeKaufmann === "yes") {
    return (
      beklagtePersonKaufmann !== "yes" ||
      objectKeysNonEmpty(context, ["gerichtsstandsvereinbarung"])
    );
  }

  return true;
}

function checkSachgebiet(context: GeldEinklagenFormularGerichtPruefenUserData) {
  const { sachgebiet, fuerWenBeklagen, mietePachtRaum } = context;
  switch (sachgebiet) {
    case "urheberrecht": {
      return (
        ((fuerWenBeklagen === "person" &&
          objectKeysNonEmpty(context, ["beklagtePersonGeldVerdienen"])) ||
          fuerWenBeklagen === "organisation") &&
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
    objectKeysNonEmpty(context, ["fuerWenBeklagen"]) && checkSachgebiet(context)
  );
};
