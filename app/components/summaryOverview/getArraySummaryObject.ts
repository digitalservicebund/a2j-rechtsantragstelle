import { Context } from "~/domains/contexts";
import { arrayChar } from "~/services/array";
import { arrayIsNonEmpty } from "~/util/array";
import { SummaryOverviewBoxItemType } from "./SummaryOverviewBoxItem";

export const getArraySummaryObject = (
  boxItems: SummaryOverviewBoxItemType[],
  userData: Context,
) => {
  if (!arrayIsNonEmpty(boxItems)) {
    return undefined;
  }

  const arrayObjectName = boxItems[0].field.split(arrayChar)[0];
  return userData[arrayObjectName];
};
