import EditIcon from "@digitalservicebund/icons/EditOutlined";
import Heading from "~/components/common/Heading";
import { StandaloneLink } from "~/components/common/StandaloneLink";
import { useFormFlow } from "~/components/formFlowContext";
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

  // Debug for auto-generated content
  if (stepId.startsWith("auto-generated:")) {
    console.log("🔍 Debug SummaryOverviewBox rendering:", {
      boxId,
      stepId,
      title,
      boxItemsCount: boxItems.length,
      firstBoxItem: boxItems[0]
    });
  }

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
      {stepId.startsWith("auto-generated:") ? (
        <div className="flex basis gap-2 pl-2 items-start justify-end h-min text-gray-400">
          <EditIcon className="shrink-0 inline opacity-50" />
          <span className="text-sm">Nicht bearbeitbar</span>
        </div>
      ) : (
        <StandaloneLink
          url={`${flowId}${stepId}`}
          className="flex basis gap-2 pl-2 ds-link-01-bold items-start justify-end h-min"
          icon={<EditIcon className="shrink-0 inline" />}
          text={"Bearbeiten"}
        />
      )}
    </div>
  );
};

export default SummaryOverviewBox;
