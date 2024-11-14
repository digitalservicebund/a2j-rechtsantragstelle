import type { FluggastrechtContext } from "../context";

export const getTotalClaimingPeople = ({
  weiterePersonen,
}: FluggastrechtContext) => {
  return (
    1 + (typeof weiterePersonen !== "undefined" ? weiterePersonen.length : 0)
  );
};
