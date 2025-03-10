import Heading, { HeadingProps } from "../Heading";
import SummaryOverviewBoxWrapped, {
  SummaryOverviewBoxWrappedProps,
} from "./SummaryOverviewBoxWrapped";

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
