import EditButton from "@digitalservicebund/icons/CreateOutlined";
import { Context } from "~/domains/contexts";
import Heading from "../Heading";
import { getSortedFields } from "./getSortedFields";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";
import Button from "../Button";
import { useFlowFormular } from "../form/flowFormularContext";

type Props = {
  readonly title?: string;
  readonly stepId: string;
  readonly boxId: number;
  readonly sortedFields?: string;
  readonly hiddenFieldsList?: string[];
  readonly userData: Context;
  readonly fields: string[];
};

const SummaryOverviewBoxWrapped = ({
  boxId,
  stepId,
  userData,
  hiddenFieldsList,
  sortedFields,
  fields,
  title,
}: Props) => {
  const { translations, flowId } = useFlowFormular();
  const pageFields = fields.filter(
    (field) => !hiddenFieldsList?.includes(field),
  );

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
          {getSortedFields(pageFields, sortedFields).map((field) => (
            <SummaryOverviewBoxItem
              key={`${boxId}-${field}`}
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

export default SummaryOverviewBoxWrapped;
