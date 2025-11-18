import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

function checkSachgebiet(context: GeldEinklagenFormularGerichtPruefenUserData) {
  const { sachgebiet, mietePachtVertrag, versicherungVertrag, reiseArt } =
    context;
  switch (sachgebiet) {
    case "anderesRechtsproblem":
    case "urheberrecht":
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
        objectKeysNonEmpty(context, ["versicherungsnehmer"])
      );
    }
    case "reisen": {
      return reiseArt === "andereReise";
    }
    case "verkehrsunfall": {
      return objectKeysNonEmpty(context, ["verkehrsunfallStrassenverkehr"]);
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
    objectKeysNonEmpty(context, ["ausgeschlossen", "sachgebiet"]) &&
    checkSachgebiet(context)
  );
};
