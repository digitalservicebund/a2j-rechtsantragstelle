import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

export const shouldVisitGerichtSuchePostleitzahlKlagendePerson: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    const {
      klagendeHaustuergeschaeft,
      sachgebiet,
      gegenWenBeklagen,
      beklagtePersonGeldVerdienen,
      versicherungsnummer,
      gerichtsstandsvereinbarung,
      beklagtePersonKaufmann,
      klagendeKaufmann,
    } = context;

    if (klagendeHaustuergeschaeft === "yes") {
      const isRelevantSachgebiet = [
        "miete",
        "reisen",
        "anderesRechtsproblem",
      ].includes(sachgebiet as string);
      const isRelevantUrheberrecht =
        sachgebiet === "urheberrecht" &&
        (gegenWenBeklagen === "organisation" ||
          (gegenWenBeklagen === "person" &&
            beklagtePersonGeldVerdienen === "yes"));

      if (isRelevantSachgebiet || isRelevantUrheberrecht) {
        return true;
      }
    }

    const isVersicherungCase =
      sachgebiet === "versicherung" &&
      versicherungsnummer === "yes" &&
      (gerichtsstandsvereinbarung === "no" ||
        beklagtePersonKaufmann === "no" ||
        klagendeKaufmann === "no");

    return isVersicherungCase;
  };

export const shouldVisitGerichtSuchePostleitzahlVerkehrsunfall: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    return (
      context.sachgebiet === "verkehrsunfall" &&
      context.verkehrsunfallStrassenverkehr === "yes" &&
      (context.klagendeKaufmann === "no" ||
        context.beklagtePersonKaufmann === "no" ||
        context.gerichtsstandsvereinbarung === "no")
    );
  };

export const shouldVisitGerichtSuchePostleitzahlWohnraum: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    return (
      context.sachgebiet === "miete" &&
      context.mietePachtVertrag === "yes" &&
      context.mietePachtRaum === "yes"
    );
  };
