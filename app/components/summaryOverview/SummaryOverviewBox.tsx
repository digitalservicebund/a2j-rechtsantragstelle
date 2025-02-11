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
    <div className="first:pt-0 scroll-my-40 !mt-8">
      <div className="space-y-16 bg-white pt-32 pb-44 px-32">
        {title && (
          <Heading
            text={title}
            tagName="p"
            className="mb-16"
            look="ds-heading-03-bold"
          />
        )}

        {_sortedFields.map((field) => (
          <SummaryOverviewBoxItem
            key={`${id}-${field}`}
            fieldName={field}
            translations={translations}
            userData={userData}
          />
        ))}

        <div>
          <Button
            iconLeft={<EditButton />}
            href={`${flowId}${stepId}`}
            look="tertiary"
            size="large"
            className="w-fit"
          >
            Bearbeiten
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SummaryOverviewBox;
