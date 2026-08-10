import { updateSession } from "~/services/session.server";
import { type GeldEinklagenFormularUserData } from "../formular/userData";
import merge from "lodash/merge";
import { type Session } from "react-router";
import { arrayIsNonEmpty } from "~/util/array";

export const updateQuantityPersonenTypesPerAbschnitt = async (
  _request: Request,
  userData: GeldEinklagenFormularUserData,
  flowSession: Session,
) => {
  if (!arrayIsNonEmpty(userData.abschnitte)) {
    return;
  }

  const abschnitteWithUpdatedQuantity = userData.abschnitte.map((abschnitt) => {
    const updatedAbschnitt = { ...abschnitt };

    if (arrayIsNonEmpty(abschnitt.personen)) {
      const klagendeCount = abschnitt.personen.filter(
        (person) => person.personAuswahl === "klagende",
      ).length;
      const beklagteCount = abschnitt.personen.filter(
        (person) => person.personAuswahl === "beklagte",
      ).length;

      updatedAbschnitt.qtdPersonenAsKlagende = klagendeCount;
      updatedAbschnitt.qtdPersonenAsBeklagte = beklagteCount;
    } else {
      updatedAbschnitt.qtdPersonenAsKlagende = 0;
      updatedAbschnitt.qtdPersonenAsBeklagte = 0;
    }

    return updatedAbschnitt;
  });

  const updatedUserData = merge({}, userData, {
    abschnitte: abschnitteWithUpdatedQuantity,
  });

  updateSession(flowSession, updatedUserData);
};
