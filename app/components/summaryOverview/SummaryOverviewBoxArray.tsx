import { addArrayIndexToPathUrl } from "./addArrayIndexToPathUrl";
import { getArraySummaryObject } from "./getArraySummaryObject";
import SummaryOverviewBox from "./SummaryOverviewBox";
import { SummaryOverviewBoxWrappedProps } from "./SummaryOverviewBoxWrapped";
import { useFormFlow } from "../form/formFlowContext";

type Props = Pick<
  SummaryOverviewBoxWrappedProps,
  "title" | "boxItems" | "stepId"
> & {
  readonly boxId: number;
};

const SummaryOverviewBoxArray = ({ boxId, boxItems, title, stepId }: Props) => {
  const { userData } = useFormFlow();
  const arrayObject = getArraySummaryObject(boxItems, userData);

  if (!Array.isArray(arrayObject)) {
    return null;
  }

  return arrayObject.map((object, index) => (
    <SummaryOverviewBox
      // eslint-disable-next-line react/no-array-index-key
      key={boxId + index}
      boxId={boxId}
      stepId={addArrayIndexToPathUrl(stepId, index)}
      userData={object}
      boxItems={boxItems}
      title={title}
    />
  ));
};

export default SummaryOverviewBoxArray;
