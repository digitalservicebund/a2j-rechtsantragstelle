import { type HeadingProps } from "../Heading";

export type SummaryOverviewBoxWrappedProps = {
  readonly title?: HeadingProps;
  readonly stepId: string;
  readonly id: number;
  readonly boxItems: SummaryOverviewBoxItemType[];
};

export type SummaryOverviewBoxItemType = {
  readonly title?: string;
  readonly inlineItems: Array<{
    readonly field: string;
    readonly emptyValuePlaceholder?: string;
  }>;
};
