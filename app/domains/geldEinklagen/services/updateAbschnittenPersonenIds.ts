import { updateSession } from "~/services/session.server";
import { type GeldEinklagenFormularUserData } from "../formular/userData";
import merge from "lodash/merge";
import { type Session } from "react-router";
import { arrayIsNonEmpty } from "~/util/array";

export const updateAbschnittenPersonenIds = async (
  _request: Request,
  userData: GeldEinklagenFormularUserData,
  flowSession: Session,
) => {
  if (!arrayIsNonEmpty(userData.abschnitte)) {
    return;
  }

  const abschnitteWithUpdatedPersonenIds = userData.abschnitte.map(
    (abschnitt) => {
      const updatedAbschnitt = { ...abschnitt };

      if (arrayIsNonEmpty(abschnitt.personen)) {
        const personIdAsKlagende = abschnitt.personen.find(
          (person) => person.personAuswahl === "klagende",
        )?.personId;
        const personIdAsBeklagte = abschnitt.personen.find(
          (person) => person.personAuswahl === "beklagte",
        )?.personId;

        updatedAbschnitt.personIdAsKlagende = personIdAsKlagende ?? "";
        updatedAbschnitt.personIdAsBeklagte = personIdAsBeklagte ?? "";
      } else {
        updatedAbschnitt.personIdAsKlagende = "";
        updatedAbschnitt.personIdAsBeklagte = "";
      }

      return updatedAbschnitt;
    },
  );

  const updatedUserData = merge({}, userData, {
    abschnitte: abschnitteWithUpdatedPersonenIds,
  });

  updateSession(flowSession, updatedUserData);
};
