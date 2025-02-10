import EditButton from "@digitalservicebund/icons/CreateOutlined";
import {
  getTranslationByKey,
  Translations,
} from "~/services/translations/getTranslationByKey";
import Button from "../Button";
import { useFlowFormular } from "../form/flowFormularContext";
import Heading from "../Heading";

export type SummaryOverviewBoxProps = {
  readonly title?: string;
  readonly stepId: string;
  readonly sortedFields?: string;
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
      return pageFields.indexOf(x) - pageFields.indexOf(y);
    }
    if (indexX === -1) return 1;
    if (indexY === -1) return -1;

    return indexX - indexY;
  });
};

function getTranslationByKeyForUserData(
  key: string,
  translations?: Translations,
): string {
  const translation = translations?.[key];
  return translation ?? key;
}

const SummaryOverviewBox = ({
  title,
  stepId,
  sortedFields,
}: SummaryOverviewBoxProps) => {
  const { userData, validFlowPages, translations, flowId } = useFlowFormular();

  if (!validFlowPages[stepId]) {
    return null;
  }

  const pageFields = validFlowPages[stepId];

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
            <div key={field} className="first:pt-0 scroll-my-40">
              <Heading
                text={getTranslationByKey(field, translations)}
                tagName="p"
                look="ds-label-01-bold"
              />
              {getTranslationByKeyForUserData(
                userData[field] as string,
                translations,
              )}
            </div>
          ))}

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
  );
};

export default SummaryOverviewBox;
