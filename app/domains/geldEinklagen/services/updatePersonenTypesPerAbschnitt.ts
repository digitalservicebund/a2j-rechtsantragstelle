import { updateSession } from "~/services/session.server";
import { type GeldEinklagenFormularUserData } from "../formular/userData";
import merge from "lodash/merge";
import { type Session } from "react-router";
import { arrayIsNonEmpty } from "~/util/array";

export const updatePersonenTypesPerAbschnitt = async (
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
      const hasKlagendePersonen = abschnitt.personen.some(
        (person) => person.personAuswahl === "klagende",
      );
      const hasBeklagtePersonen = abschnitt.personen.some(
        (person) => person.personAuswahl === "beklagte",
      );

      updatedAbschnitt.hasPersonenAsKlagende = hasKlagendePersonen
        ? "true"
        : "false";
      updatedAbschnitt.hasPersonenAsBeklagte = hasBeklagtePersonen
        ? "true"
        : "false";
    } else {
      updatedAbschnitt.hasPersonenAsKlagende = "false";
      updatedAbschnitt.hasPersonenAsBeklagte = "false";
    }

    return updatedAbschnitt;
  });

  const updatedUserData = merge({}, userData, {
    abschnitte: abschnitteWithUpdatedQuantity,
  });

  updateSession(flowSession, updatedUserData);
};
