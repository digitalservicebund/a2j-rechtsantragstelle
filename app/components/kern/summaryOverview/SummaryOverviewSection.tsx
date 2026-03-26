import KernHeading, { type KernHeadingProps } from "../KernHeading";
import SummaryOverviewBoxWrapped from "./SummaryOverviewBoxWrapped";
import { type SummaryOverviewBoxWrappedProps } from "./types";

type Props = {
  readonly title: KernHeadingProps;
  readonly boxes: SummaryOverviewBoxWrappedProps[];
};

const KernSummaryOverviewSection = ({ title, boxes }: Props) => {
  return (
    <div className="flex flex-col gap-kern-space-default">
      <KernHeading size="medium" {...title} managedByParent />
      {boxes.map(({ id, stepId, boxItems, title: boxTitle }) => (
        <SummaryOverviewBoxWrapped
          key={id}
          title={boxTitle}
          stepId={stepId}
          id={id}
          boxItems={boxItems}
        />
      ))}
    </div>
  );
};

export default KernSummaryOverviewSection;
