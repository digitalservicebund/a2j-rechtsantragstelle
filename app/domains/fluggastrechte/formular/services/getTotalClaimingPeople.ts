import type { CompensationClaimContext } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";

const numOfPlaintiff = 1;

export const getTotalClaimingPeople = ({
  weiterePersonen,
}: CompensationClaimContext) =>
  numOfPlaintiff + (weiterePersonen ? weiterePersonen.length : 0);
