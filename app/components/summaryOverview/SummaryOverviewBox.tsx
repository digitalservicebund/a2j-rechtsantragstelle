import EditButton from "@digitalservicebund/icons/CreateOutlined";
import Button from "../Button";
import { useFlowFormular } from "../form/flowFormularContext";
import Heading from "../Heading";
import { getSortedFields } from "./getSortedFields";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";

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
  const { userData, validFlowPages, translations, flowId } = useFlowFormular();

  if (!validFlowPages[stepId]) {
    return null;
  }

  const hiddenFieldsList = hiddenFields?.split("\n");

  const pageFields = validFlowPages[stepId].filter(
    (field) => !hiddenFieldsList?.includes(field),
  );

  const _sortedFields = getSortedFields(pageFields, sortedFields);

  return (
    <div className="mt-8">
      <div className="bg-white pt-32 pb-44 px-32">
        {title && (
          <Heading
            text={title}
            className="mb-16"
            tagName="p"
            look="ds-heading-03-bold"
          />
        )}

        <dl>
          {_sortedFields.map((field) => (
            <SummaryOverviewBoxItem
              key={`${id}-${field}`}
              fieldName={field}
              translations={translations}
              userData={userData}
            />
          ))}
        </dl>

        <Button
          iconLeft={<EditButton />}
          href={`${flowId}${stepId}`}
          look="tertiary"
          size="large"
          className="w-fit mt-16"
        >
          Bearbeiten
        </Button>
      </div>
    </div>
  );
};

export default SummaryOverviewBox;
