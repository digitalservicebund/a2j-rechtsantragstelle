import { type ErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { type ErbausschlagungAnfrageKind } from "./createChildrenOfRenunciantPerson";
import { toDate } from "~/services/validation/dateObject";

export const getChildBirthDate = (child: ErbausschlagungAnfrageKind) => {
  if (!child.geburtsdatum) {
    return undefined;
  }

  const birthDate = toDate(child.geburtsdatum);

  if (Number.isNaN(birthDate.getTime())) {
    return undefined;
  }

  return birthDate;
};

export const getSortedChildren = (
  kinder: ErbausschlagungAnfrageUserData["kinder"],
) => {
  return (kinder ?? []).toSorted((leftChild, rightChild) => {
    const leftBirthTimestamp = getChildBirthDate(leftChild)?.getTime();
    const rightBirthTimestamp = getChildBirthDate(rightChild)?.getTime();

    if (leftBirthTimestamp === undefined && rightBirthTimestamp === undefined) {
      return 0;
    }

    if (leftBirthTimestamp === undefined) {
      return 1;
    }

    if (rightBirthTimestamp === undefined) {
      return -1;
    }

    return rightBirthTimestamp - leftBirthTimestamp;
  });
};
