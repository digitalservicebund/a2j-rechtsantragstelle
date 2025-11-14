import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "./guards";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

export const doneGerichtSuchen: GeldEinklagenGerichtPruefenDaten = ({
  context,
}) => {
  const hasPostleitzahlBeklagtePerson = objectKeysNonEmpty(context, [
    "postleitzahlBeklagtePerson",
  ]);
  const hasPostleitzahlSecondary = objectKeysNonEmpty(context, [
    "postleitzahlSecondary",
  ]);

  const onlyPostleitzahlSecondaryRelevant =
    context.gerichtsstandsvereinbarung === "yes" ||
    shouldVisitGerichtSuchenPostleitzahlWohnraum({ context });

  if (onlyPostleitzahlSecondaryRelevant) {
    return hasPostleitzahlSecondary;
  }

  const shouldHavePostleitzahlSecondaryRelevant =
    shouldVisitGerichtSuchenPostleitzahlKlagendePerson({ context }) ||
    shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({ context }) ||
    context.sachgebiet === "schaden";

  return (
    hasPostleitzahlBeklagtePerson &&
    ((shouldHavePostleitzahlSecondaryRelevant && hasPostleitzahlSecondary) ||
      !shouldHavePostleitzahlSecondaryRelevant)
  );
};
