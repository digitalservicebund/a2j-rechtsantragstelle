import SummaryOverviewBoxWrapped from "./SummaryOverviewBoxWrapped";
import { type SummaryOverviewBoxWrappedProps } from "./types";
import KernHeading, {
  type KernHeadingProps,
} from "~/components/kern/KernHeading";

type Props = {
  readonly title: KernHeadingProps;
  readonly boxes: SummaryOverviewBoxWrappedProps[];
};

const SummaryOverviewSection = ({ title, boxes }: Props) => {
  return (
    <>
      <KernHeading {...title} className="mt-20" />
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
