import EditButton from "@digitalservicebund/icons/CreateOutlined";
import { Context } from "~/domains/contexts";
import Heading from "../Heading";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";
import Button from "../Button";
import { useFlowFormular } from "../form/flowFormularContext";

type Props = {
  readonly title?: string;
  readonly stepId: string;
  readonly boxId: number;
  readonly userData: Context;
  readonly boxPageFields: string[];
};

const SummaryOverviewBoxWrapped = ({
  boxId,
  stepId,
  userData,
  boxPageFields,
  title,
}: Props) => {
  const { translations, flowId } = useFlowFormular();

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
          {boxPageFields.map((field) => (
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
