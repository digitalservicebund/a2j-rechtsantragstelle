import EditButton from "@digitalservicebund/icons/CreateOutlined";
import { Context } from "~/domains/contexts";
import Heading from "../Heading";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";
import Button from "../Button";
import { SummaryOverviewBoxWrappedProps } from "./SummaryOverviewBoxWrapped";
import { useFormFlow } from "../form/formFlowContext";

type Props = Pick<
  SummaryOverviewBoxWrappedProps,
  "title" | "boxItems" | "stepId"
> & {
  readonly boxId: number;
  readonly userData: Context;
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
        {title && <Heading {...title} className="mb-16" />}

        <dl>
          {boxItems.map(
            (
              { title: boxItemTitle, displayEmptyValue, inlineItems },
              index,
            ) => (
              <SummaryOverviewBoxItem
                key={`${boxId}-${boxItemTitle ?? index}`}
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
