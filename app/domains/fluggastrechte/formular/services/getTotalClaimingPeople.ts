import type { FluggastrechteUserData } from "../userData";

const numOfPlaintiff = 1;

export const getTotalClaimingPeople = ({
  weiterePersonen,
}: FluggastrechteUserData) =>
  numOfPlaintiff + (weiterePersonen ? weiterePersonen.length : 0);
