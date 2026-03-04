import { type GenericGuard } from "~/domains/guards.server";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";

type GeldEinklagenGerichtPruefenDaten =
  GenericGuard<GeldEinklagenFormularGerichtPruefenUserData>;

export const shouldVisitGerichtSuchenPostleitzahlKlagendePerson: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    const {
      klagendeHaustuergeschaeft,
      sachgebiet,
      gegenWenBeklagen,
      beklagtePersonGeldVerdienen,
      versicherungsnehmer,
      gerichtsstandsvereinbarung,
      beklagtePersonKaufmann,
      klagendeKaufmann,
    } = context;

    if (klagendeHaustuergeschaeft === "yes") {
      const isRelevantSachgebiet = [
        "miete",
        "reisen",
        "anderesRechtsproblem",
      ].includes(sachgebiet ?? "");
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
      versicherungsnehmer === "yes" &&
      (gerichtsstandsvereinbarung === "no" ||
        beklagtePersonKaufmann === "no" ||
        klagendeKaufmann === "no");

    return isVersicherungCase;
  };

export const shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    return (
      context.sachgebiet === "verkehrsunfall" &&
      context.verkehrsunfallStrassenverkehr === "yes" &&
      (context.klagendeKaufmann === "no" ||
        context.beklagtePersonKaufmann === "no" ||
        context.gerichtsstandsvereinbarung === "no")
    );
  };

export const shouldVisitGerichtSuchenPostleitzahlWohnraum: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    return (
      context.sachgebiet === "miete" &&
      context.mietePachtVertrag === "yes" &&
      context.mietePachtRaum === "yes"
    );
  };

export const shouldVisitGerichtSuchenGerichtsstandsvereinbarung: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    const isRelevantGerichtsstandsvereinbarung =
      context.klagendeKaufmann === "yes" &&
      context.beklagtePersonKaufmann === "yes" &&
      context.gerichtsstandsvereinbarung === "yes";

    if (isRelevantGerichtsstandsvereinbarung) {
      const isRelevantNotHaveVerbraucher =
        context.sachgebiet === "schaden" ||
        context.sachgebiet === "verkehrsunfall" ||
        context.sachgebiet === "versicherung" ||
        (context.sachgebiet === "miete" && context.mietePachtVertrag === "no");

      return (
        isRelevantNotHaveVerbraucher || context.klagendeVerbraucher === "no"
      );
    }

    return false;
  };

export const shouldVisitGerichtSuchenBeklagtePostleitzahl: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    return (
      !shouldVisitGerichtSuchenGerichtsstandsvereinbarung({ context }) &&
      !shouldVisitGerichtSuchenPostleitzahlWohnraum({ context })
    );
  };

export const shouldVisitGerichtSuchenSecondaryPostleitzahl: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    return (
      shouldVisitGerichtSuchenGerichtsstandsvereinbarung({ context }) ||
      shouldVisitGerichtSuchenPostleitzahlWohnraum({ context }) ||
      shouldVisitGerichtSuchenPostleitzahlKlagendePerson({ context }) ||
      shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({ context }) ||
      context.sachgebiet === "schaden"
    );
  };

export const shouldVisitPilotGerichtAuswahl: GeldEinklagenGerichtPruefenDaten =
  ({ context }) => {
    return (
      shouldVisitGerichtSuchenBeklagtePostleitzahl({ context }) &&
      shouldVisitGerichtSuchenSecondaryPostleitzahl({ context })
    );
  };
