import SummaryOverviewBoxArray from "./SummaryOverviewBoxArray";
import SummaryOverviewBoxWrapped from "./SummaryOverviewBoxWrapped";
import { useFlowFormular } from "../form/flowFormularContext";

export type SummaryOverviewBoxProps = {
  readonly title?: string;
  readonly stepId: string;
  readonly id: number;
  readonly fields: string;
};

const SummaryOverviewBox = ({
  title,
  id,
  stepId,
  fields,
}: SummaryOverviewBoxProps) => {
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
    <SummaryOverviewBoxWrapped
      boxId={id}
      stepId={stepId}
      userData={userData}
      boxPageFields={boxPageFields}
      title={title}
    />
  );
};

export default SummaryOverviewBox;
