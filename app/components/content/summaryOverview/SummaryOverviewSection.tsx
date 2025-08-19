import Heading, { type HeadingProps } from "~/components/common/Heading";
import SummaryOverviewBoxWrapped from "./SummaryOverviewBoxWrapped";
import { type SummaryOverviewBoxWrappedProps } from "./types";

type Props = {
  readonly title: HeadingProps;
  readonly boxes: SummaryOverviewBoxWrappedProps[];
};

const SummaryOverviewSection = ({ title, boxes }: Props) => {
  return (
    <>
      <Heading {...title} className="mt-20" />
      {boxes.map(({ id, stepId, boxItems, title: boxTitle }) => (
        <SummaryOverviewBoxWrapped
          key={id}
          title={boxTitle}
          stepId={stepId}
          id={id}
          boxItems={boxItems}
        />
      ))}
    </>
  );
};

export default SummaryOverviewSection;
