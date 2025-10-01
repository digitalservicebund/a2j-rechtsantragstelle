import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

function checkBesondere(context: GeldEinklagenFormularGerichtPruefenUserData) {
  const { besondere, mietePachtVertrag, versicherungVertrag, reiseArt } =
    context;
  switch (besondere) {
    case "anderesRechtsproblem":
    case "schaden": {
      return true;
    }
    case "miete": {
      return (
        mietePachtVertrag === "no" ||
        objectKeysNonEmpty(context, ["mietePachtRaum"])
      );
    }
    case "versicherung": {
      return (
        versicherungVertrag === "no" ||
        objectKeysNonEmpty(context, ["versicherungsnummer"])
      );
    }
    case "reisen": {
      return reiseArt === "andereReise";
    }
    case "verkehrsunfall": {
      return objectKeysNonEmpty(context, ["verkehrsunfallStrassenverkehr"]);
    }
    case "urheberrecht": {
      return true;
    }
    case undefined:
    default: {
      return false;
    }
  }
}

export const sachgebietDone: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  return (
    objectKeysNonEmpty(context, ["sachgebietAusgeschlossen", "besondere"]) &&
    checkBesondere(context)
  );
};
