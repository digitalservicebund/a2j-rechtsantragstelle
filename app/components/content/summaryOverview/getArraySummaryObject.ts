import { type UserData } from "~/domains/userData";
import { arrayChar } from "~/services/array";
import { arrayIsNonEmpty } from "~/util/array";
import { type SummaryOverviewBoxItemType } from "./SummaryOverviewBoxItem";

export const getArraySummaryObject = (
  boxItems: SummaryOverviewBoxItemType[],
  userData: UserData,
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
