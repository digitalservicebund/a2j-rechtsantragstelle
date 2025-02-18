import EditButton from "@digitalservicebund/icons/CreateOutlined";
import { Context } from "~/domains/contexts";
import Heading from "../Heading";
import SummaryOverviewBoxItem, {
  SummaryOverviewBoxItemType,
} from "./SummaryOverviewBoxItem";
import Button from "../Button";
import { useFormFlow } from "../form/formFlowContext";

type Props = {
  readonly title?: string;
  readonly stepId: string;
  readonly boxId: number;
  readonly userData: Context;
  readonly boxItems: SummaryOverviewBoxItemType[];
};

const SummaryOverviewBox = ({
  boxId,
  stepId,
  userData,
  boxItems,
  title,
}: Props) => {
  const { translations, flowId } = useFormFlow();

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
          {boxItems.map(
            ({
              field,
              title: boxItemTitle,
              displayEmptyValue,
              inlineItems,
            }) => (
              <SummaryOverviewBoxItem
                key={`${boxId}-${field}`}
                field={field}
                title={boxItemTitle}
                translations={translations}
                userData={userData}
                displayEmptyValue={displayEmptyValue}
                inlineItems={inlineItems}
              />
            ),
          )}
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
