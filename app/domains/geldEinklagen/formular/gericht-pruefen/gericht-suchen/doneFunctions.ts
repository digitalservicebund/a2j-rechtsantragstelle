import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "./guards";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

const hasEdgeCasesDataForSecondary: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  const hasEdgeCase = edgeCasesForPlz(context.postleitzahlSecondary).length > 0;

  return hasEdgeCase
    ? objectKeysNonEmpty(context, [
        "strasseSekundaer",
        "strasseNummerSekundaer",
      ])
    : true;
};

const hasEdgeCasesDataForBeklagtePerson: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  const hasEdgeCase =
    edgeCasesForPlz(context.postleitzahlBeklagtePerson).length > 0;

  return hasEdgeCase
    ? objectKeysNonEmpty(context, ["strasseBeklagte", "strasseNummerBeklagte"])
    : true;
};

export const doneGerichtSuchen: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  const hasPostleitzahlBeklagtePerson = objectKeysNonEmpty(context, [
    "postleitzahlBeklagtePerson",
  ]);

  const hasEdgeCaseBeklagtePerson = hasEdgeCasesDataForBeklagtePerson({
    context,
  });

  const hasPostleitzahlSecondary = objectKeysNonEmpty(context, [
    "postleitzahlSecondary",
  ]);

  const hasEdgeCaseSecondary = hasEdgeCasesDataForSecondary({
    context,
  });

  const onlyPostleitzahlSecondaryRelevant =
    context.gerichtsstandsvereinbarung === "yes" ||
    shouldVisitGerichtSuchenPostleitzahlWohnraum({ context });

  if (onlyPostleitzahlSecondaryRelevant) {
    return hasPostleitzahlSecondary && hasEdgeCaseSecondary;
  }

  const shouldHavePostleitzahlSecondaryRelevant =
    shouldVisitGerichtSuchenPostleitzahlKlagendePerson({ context }) ||
    shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({ context }) ||
    context.sachgebiet === "schaden";

  return (
    hasPostleitzahlBeklagtePerson &&
    hasEdgeCaseBeklagtePerson &&
    ((shouldHavePostleitzahlSecondaryRelevant &&
      hasPostleitzahlSecondary &&
      hasEdgeCaseSecondary) ||
      !shouldHavePostleitzahlSecondaryRelevant)
  );
};
