import { type UserData } from "~/domains/userData";
import { arrayChar } from "~/services/array";
import { type SummaryOverviewBoxItemType } from "./SummaryOverviewBoxItem";

export const getArraySummaryObject = (
  boxItems: SummaryOverviewBoxItemType[],
  userData: UserData,
  // eslint-disable-next-line sonarjs/function-return-type
) => {
  for (const item of boxItems) {
    const inlineItem = item.inlineItems.find((item) => item.field);
    if (inlineItem) {
      const arrayObjectName = inlineItem.field.split(arrayChar)[0];
      return userData[arrayObjectName];
    }
  }
};
