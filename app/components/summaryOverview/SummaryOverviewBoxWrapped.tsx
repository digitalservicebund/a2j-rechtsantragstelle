import SummaryOverviewBox from "./SummaryOverviewBox";
import SummaryOverviewBoxArray from "./SummaryOverviewBoxArray";
import { SummaryOverviewBoxItemType } from "./SummaryOverviewBoxItem";
import { useFlowFormular } from "../form/flowFormularContext";

export type SummaryOverviewBoxWrappedProps = {
  readonly title?: string;
  readonly stepId: string;
  readonly id: number;
  readonly boxItems: SummaryOverviewBoxItemType[];
};

const SummaryOverviewBoxWrapped = ({
  title,
  id,
  stepId,
  boxItems,
}: SummaryOverviewBoxWrappedProps) => {
  const { userData, validFlowPages } = useFlowFormular();

  if (!validFlowPages[stepId]) {
    return null;
  }

  const { isArrayPage } = validFlowPages[stepId];

  if (isArrayPage) {
    return (
      <SummaryOverviewBoxArray
        boxId={id}
        title={title}
        boxItems={boxItems}
        stepId={stepId}
      />
    );
  }

  return (
    <SummaryOverviewBox
      boxId={id}
      stepId={stepId}
      userData={userData}
      boxItems={boxItems}
      title={title}
    />
  );
};

export default SummaryOverviewBoxWrapped;
