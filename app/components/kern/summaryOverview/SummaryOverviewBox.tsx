import { useFormFlow } from "~/components/formFlowContext";
import { type UserData } from "~/domains/userData";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";
import { type SummaryOverviewBoxWrappedProps } from "./types";
import KernHeading from "../KernHeading";
import { KernIcon } from "../common/KernIcon";

type Props = Pick<
  SummaryOverviewBoxWrappedProps,
  "title" | "boxItems" | "stepId"
> & {
  readonly boxId: number;
  readonly userData: UserData;
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
    <div className="bg-white p-kern-space-default flex flex-col gap-kern-space-x-large mb-kern-space-small ">
      <div>
        {title && (
          <KernHeading
            {...title}
            text={
              arrayPositionTitle
                ? `${title.text} ${arrayPositionTitle}`
                : title.text
            }
            className="mb-16"
            type="label"
            size="large"
            managedByParent
          />
        )}
        {boxItems.map(({ title: boxItemTitle, inlineItems }, index) => (
          <SummaryOverviewBoxItem
            // oxlint-disable-next-line react/no-array-index-key
            key={`${boxId}-${boxItemTitle ?? index}`}
            title={boxItemTitle}
            translations={translations}
            userData={userData}
            inlineItems={inlineItems}
          />
        ))}
      </div>
      <a href={`${flowId}${stepId}`} className="kern-link no-underline!">
        <KernIcon name="edit" />
        Bearbeiten
      </a>
    </div>
  );
};

export default SummaryOverviewBox;
