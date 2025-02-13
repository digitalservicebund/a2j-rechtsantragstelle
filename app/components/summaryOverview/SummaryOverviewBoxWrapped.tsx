import SummaryOverviewBox from "./SummaryOverviewBox";
import SummaryOverviewBoxArray from "./SummaryOverviewBoxArray";
import { useFlowFormular } from "../form/flowFormularContext";

export type SummaryOverviewBoxWrappedProps = {
  readonly title?: string;
  readonly stepId: string;
  readonly id: number;
  readonly fields: string;
};

const SummaryOverviewBoxWrapped = ({
  title,
  id,
  stepId,
  fields,
}: SummaryOverviewBoxWrappedProps) => {
  const { userData, validFlowPages } = useFlowFormular();

  if (!validFlowPages[stepId]) {
    return null;
  }

  const boxPageFields = fields.split("\n");

  const { isArrayPage } = validFlowPages[stepId];

  if (isArrayPage) {
    return (
      <SummaryOverviewBoxArray
        boxId={id}
        title={title}
        arrayBoxPageFields={boxPageFields}
        stepId={stepId}
      />
    );
  }

  return (
    <SummaryOverviewBox
      boxId={id}
      stepId={stepId}
      userData={userData}
      boxPageFields={boxPageFields}
      title={title}
    />
  );
};

export default SummaryOverviewBoxWrapped;
