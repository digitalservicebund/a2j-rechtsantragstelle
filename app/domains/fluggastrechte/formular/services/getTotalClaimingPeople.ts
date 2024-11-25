import type { FluggastrechtContext } from "../context";

const numOfPlaintiff = 1;

export const getTotalClaimingPeople = ({
  weiterePersonen,
}: FluggastrechtContext) => {
  return (
    numOfPlaintiff +
    (typeof weiterePersonen !== "undefined" ? weiterePersonen.length : 0)
  );
};
