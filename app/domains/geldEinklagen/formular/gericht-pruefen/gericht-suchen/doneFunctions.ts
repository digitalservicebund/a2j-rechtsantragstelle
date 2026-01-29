import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import {
  shouldVisitGerichtSuchenGerichtsstandsvereinbarung,
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "./guards";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

const hasEdgeCasesDataForSecondary: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  const hasEdgeCase =
    edgeCasesForPlz(
      context.postleitzahlSecondary,
      ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE,
    ).length > 0;

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
    edgeCasesForPlz(
      context.postleitzahlBeklagtePerson,
      ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE,
    ).length > 0;

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
    shouldVisitGerichtSuchenGerichtsstandsvereinbarung({ context }) ||
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
