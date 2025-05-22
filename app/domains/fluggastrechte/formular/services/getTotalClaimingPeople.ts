import type { FluggastrechteUserData } from "../userData";

const numOfPlaintiff = 1;

export const getTotalClaimingPeople = ({
  weiterePersonen,
}: FluggastrechteUserData) => {
  return (
    numOfPlaintiff +
    (typeof weiterePersonen !== "undefined" ? weiterePersonen.length : 0)
  );
};
