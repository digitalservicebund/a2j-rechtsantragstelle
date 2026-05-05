import Heading, { type HeadingProps } from "~/components/formElements/Heading";
import SummaryOverviewBoxWrapped from "./SummaryOverviewBoxWrapped";
import { type SummaryOverviewBoxWrappedProps } from "./types";

type Props = {
  readonly title: HeadingProps;
  readonly boxes: SummaryOverviewBoxWrappedProps[];
};

const SummaryOverviewSection = ({ title, boxes }: Props) => {
  return (
    <div className="flex flex-col gap-kern-space-default">
      <Heading size="medium" {...title} managedByParent />
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

export default SummaryOverviewSection;
