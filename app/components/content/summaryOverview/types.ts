import { type KernHeadingProps } from "~/components/kern/KernHeading";
import type { AllowedUserTypes } from "~/domains/userData";

export type SummaryOverviewBoxWrappedProps = {
  readonly title?: KernHeadingProps;
  readonly stepId: string;
  readonly id: number;
  readonly boxItems: SummaryOverviewBoxItemType[];
};

export type InlineItems = Array<{
  readonly field: string;
  readonly emptyValuePlaceholder?: string;
}>;

export type SummaryOverviewBoxItemType = {
  readonly title?: string;
  readonly inlineItems: InlineItems;
};

export type FieldItems = Array<{
  fieldName: string;
  fieldValue: AllowedUserTypes;
}>;
