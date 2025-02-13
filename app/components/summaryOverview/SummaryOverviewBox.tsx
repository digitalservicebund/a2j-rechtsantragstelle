import SummaryOverviewBoxArray from "./SummaryOverviewBoxArray";
import SummaryOverviewBoxWrapped from "./SummaryOverviewBoxWrapped";
import { useFlowFormular } from "../form/flowFormularContext";

export type SummaryOverviewBoxProps = {
  readonly title?: string;
  readonly stepId: string;
  readonly id: number;
  readonly sortedFields?: string;
  readonly hiddenFields?: string;
};

const SummaryOverviewBox = ({
  title,
  id,
  stepId,
  sortedFields,
  hiddenFields,
}: SummaryOverviewBoxProps) => {
  const { userData, validFlowPages } = useFlowFormular();

  if (!validFlowPages[stepId]) {
    return null;
  }

  const hiddenFieldsList = hiddenFields?.split("\n");

  const { isArrayPage, fields } = validFlowPages[stepId];

  if (isArrayPage) {
    return (
      <SummaryOverviewBoxArray
        boxId={id}
        title={title}
        hiddenFieldsList={hiddenFieldsList}
        sortedFields={sortedFields}
        arrayPageFields={fields}
        stepId={stepId}
      />
    );
  }

  return (
    <SummaryOverviewBoxWrapped
      boxId={id}
      stepId={stepId}
      userData={userData}
      hiddenFieldsList={hiddenFieldsList}
      sortedFields={sortedFields}
      fields={fields}
      title={title}
    />
  );
};

export default SummaryOverviewBox;
