import { WEITERE_PERSONEN_START_INDEX } from "~/domains/fluggastrechte/formular/stringReplacements";
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

const getArrayPositionTitleValue = (stepId: string, index: number) => {
  if (stepId === "/persoenliche-daten/weitere-personen/person/daten") {
    return WEITERE_PERSONEN_START_INDEX + index;
  }

  return index + 1;
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
      arrayPositionTitle={getArrayPositionTitleValue(stepId, index)}
    />
  ));
};

export default SummaryOverviewBoxArray;
