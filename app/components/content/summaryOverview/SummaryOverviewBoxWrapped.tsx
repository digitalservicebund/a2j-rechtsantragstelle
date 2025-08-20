import { useFormFlow } from "~/components/formFlowContext";
import SummaryOverviewBox from "./SummaryOverviewBox";
import SummaryOverviewBoxArray from "./SummaryOverviewBoxArray";
import { type SummaryOverviewBoxWrappedProps } from "./types";

const SummaryOverviewBoxWrapped = ({
  title,
  id,
  stepId,
  boxItems,
}: SummaryOverviewBoxWrappedProps) => {
  const { userData, validFlowPages } = useFormFlow();

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
