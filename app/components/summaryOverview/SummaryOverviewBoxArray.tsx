import { arrayChar } from "~/services/array";
import SummaryOverviewBoxWrapped from "./SummaryOverviewBoxWrapped";
import { useFlowFormular } from "../form/flowFormularContext";

type Props = {
  readonly boxId: number;
  readonly arrayBoxPageFields: string[];
  readonly title?: string;
  readonly stepId: string;
};

const addArrayIndexToPathUrl = (path: string, index: string): string => {
  const segments = path.split("/");

  if (segments.length < 2) {
    return path;
  }

  segments.splice(segments.length - 1, 0, index);

  return segments.join("/");
};

const SummaryOverviewBoxArray = ({
  boxId,
  arrayBoxPageFields,
  title,
  stepId,
}: Props) => {
  const { userData } = useFlowFormular();

  const arrayObjectName = arrayBoxPageFields[0].split(arrayChar)[0];
  const arrayObject = userData[arrayObjectName];
  const arrayBoxPageFieldsWithoutArrayChar = arrayBoxPageFields.map(
    (pageField) => pageField.split(arrayChar)[1],
  );

  if (!Array.isArray(arrayObject)) {
    return null;
  }

  return arrayObject.map((object, index) => (
    <SummaryOverviewBoxWrapped
      // eslint-disable-next-line react/no-array-index-key
      key={boxId + index}
      boxId={boxId}
      stepId={addArrayIndexToPathUrl(stepId, index.toString())}
      userData={object}
      boxPageFields={arrayBoxPageFieldsWithoutArrayChar}
      title={title}
    />
  ));
};

export default SummaryOverviewBoxArray;
