import EditIcon from "@digitalservicebund/icons/EditOutlined";
import { useFormFlow } from "~/components/formFlowContext";
import Heading from "~/components/common/Heading";
import { StandaloneLink } from "~/components/common/StandaloneLink";
import { type UserData } from "~/domains/userData";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";
import { type SummaryOverviewBoxWrappedProps } from "./types";

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
    <div className="bg-white mt-8 p-16 gap-4 flex flex-col content-between sm:flex-row sm:justify-between">
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
      <StandaloneLink
        url={`${flowId}${stepId}`}
        className="flex basis gap-2 pl-2 ds-link-01-bold items-start justify-end h-min"
        icon={<EditIcon className="shrink-0 inline" />}
        text={"Bearbeiten"}
      />
    </div>
  );
};

export default SummaryOverviewBox;
