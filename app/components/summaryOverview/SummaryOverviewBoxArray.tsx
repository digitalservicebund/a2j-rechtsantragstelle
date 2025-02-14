import { arrayChar } from "~/services/array";
import { addArrayIndexToPathUrl } from "./addArrayIndexToPathUrl";
import { getArraySummaryObject } from "./getArraySummaryObject";
import SummaryOverviewBox from "./SummaryOverviewBox";
import { SummaryOverviewBoxItemType } from "./SummaryOverviewBoxItem";
import { useFlowFormular } from "../form/flowFormularContext";

type Props = {
  readonly boxId: number;
  readonly title?: string;
  readonly stepId: string;
  readonly boxItems: SummaryOverviewBoxItemType[];
};

const SummaryOverviewBoxArray = ({ boxId, boxItems, title, stepId }: Props) => {
  const { userData } = useFlowFormular();
  const arrayObject = getArraySummaryObject(boxItems, userData);

  if (!Array.isArray(arrayObject)) {
    return null;
  }

  const arrayBoxPageFieldsWithoutArrayChar = boxItems.map((items) => ({
    ...items,
    field: items.field.split(arrayChar)[1],
  }));

  return arrayObject.map((object, index) => (
    <SummaryOverviewBox
      // eslint-disable-next-line react/no-array-index-key
      key={boxId + index}
      boxId={boxId}
      stepId={addArrayIndexToPathUrl(stepId, index)}
      userData={object}
      boxItems={arrayBoxPageFieldsWithoutArrayChar}
      title={title}
    />
  ));
};

export default SummaryOverviewBoxArray;
