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

  for (const item of boxItems) {
    const inlineItem = item.inlineItems.find((item) => item.field);
    if (inlineItem) {
      const arrayObjectName = inlineItem.field.split(arrayChar)[0];
      return userData[arrayObjectName];
    }
  }
};
