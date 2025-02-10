import EditButton from "@digitalservicebund/icons/CreateOutlined";
import Button from "../Button";
import { useFlowFormular } from "../form/flowFormularContext";
import Heading from "../Heading";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";

export type SummaryOverviewBoxProps = {
  readonly title?: string;
  readonly stepId: string;
  readonly sortedFields?: string;
  readonly hiddenFields?: string;
};

const getSortedFields = (pageFields: string[], sortedFields?: string) => {
  if (typeof sortedFields === "undefined" || sortedFields.length === 0) {
    return pageFields;
  }

  const sorted = sortedFields.split("\n");

  return [...pageFields].sort((x, y) => {
    const indexX = sorted.indexOf(x);
    const indexY = sorted.indexOf(y);

    if (indexX === -1 && indexY === -1) {
      return pageFields.indexOf(x) - pageFields.indexOf(y); // Keep relative order for unsorted items
    }
    if (indexX === -1) return 1; // Move x to the end if it's not in sorted
    if (indexY === -1) return -1; // Move y to the end if it's not in sorted

    return indexX - indexY; // Sort based on sorted array order
  });
};

const SummaryOverviewBox = ({
  title,
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
          <Heading text={title} tagName="p" look="ds-heading-03-bold" />
        )}

        {_sortedFields
          .filter((field) => userData[field])
          .map((field) => (
            <SummaryOverviewBoxItem
              key={field}
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
