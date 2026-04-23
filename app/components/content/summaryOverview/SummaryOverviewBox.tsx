import { useFormFlow } from "~/components/formFlowContext";
import { type UserData } from "~/domains/userData";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";
import { type SummaryOverviewBoxWrappedProps } from "./types";
import KernHeading from "~/components/kern/KernHeading";

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
    <div className="bg-white mt-8 p-16 gap-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        {title && (
          <KernHeading
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
              // oxlint-disable-next-line react/no-array-index-key
              key={`${boxId}-${boxItemTitle ?? index}`}
              title={boxItemTitle}
              translations={translations}
              userData={userData}
              inlineItems={inlineItems}
            />
          ))}
        </dl>
      </div>
      <a
        href={`${flowId}${stepId}`}
        className="flex basis ml-auto gap-2 pl-2 ds-link-01-bold items-start h-min"
      >
        Bearbeiten
      </a>
    </div>
  );
};

export default SummaryOverviewBox;
