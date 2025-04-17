import EditIcon from "@digitalservicebund/icons/EditOutlined";
import { type Context } from "~/domains/contexts";
import Heading from "../Heading";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";
import Button from "../Button";
import { type SummaryOverviewBoxWrappedProps } from "./types";
import { useFormFlow } from "../form/formFlowContext";

type Props = Pick<
  SummaryOverviewBoxWrappedProps,
  "title" | "boxItems" | "stepId"
> & {
  readonly boxId: number;
  readonly userData: Context;
  readonly arrayPositionTitle?: number;
};

const SummaryOverviewBox = ({
  boxId,
  stepId,
  userData,
  boxItems,
  title,
  arrayPositionTitle,
}: Props) => {
  const { translations, flowId } = useFormFlow();

  return (
    <div className="mt-8">
      <div className="bg-white pt-32 pb-44 px-32 flex flex-row justify-between items-start">
        <div>
          {title && (
            <Heading
              {...title}
              text={
                arrayPositionTitle
                  ? `${title.text} ${arrayPositionTitle}`
                  : title.text
              }
              className="mb-16"
            />
          )}
          <dl>
            {boxItems.map(({ title: boxItemTitle, inlineItems }, index) => (
              <SummaryOverviewBoxItem
                key={`${boxId}-${boxItemTitle ?? index}`}
                title={boxItemTitle}
                translations={translations}
                userData={userData}
                inlineItems={inlineItems}
              />
            ))}
          </dl>
        </div>
        <Button
          iconLeft={<EditIcon className="shrink-0" />}
          href={`${flowId}${stepId}`}
          look="ghost"
        >
          Bearbeiten
        </Button>
      </div>
    </div>
  );
};

export default SummaryOverviewBox;
