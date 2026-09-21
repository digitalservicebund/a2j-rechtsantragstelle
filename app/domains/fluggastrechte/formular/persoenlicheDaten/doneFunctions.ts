import type { FluggastrechtePersoenlicheDatenUserData } from "./userData";
import { arrayIsNonEmpty } from "~/util/array";

export const weiterePersonenDone = ({
  weiterePersonen,
  isWeiterePersonen,
}: FluggastrechtePersoenlicheDatenUserData) =>
  isWeiterePersonen === "no" || arrayIsNonEmpty(weiterePersonen);
