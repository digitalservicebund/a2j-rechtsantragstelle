import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type UserData } from "~/domains/userData";
import SummaryOverviewBoxItem from "./SummaryOverviewBoxItem";
import { type SummaryOverviewBoxWrappedProps } from "./types";
import { Icon } from "../../common/Icon";
import Heading from "~/components/common/Heading";
import { SummaryOverviewBoxBegruendungBeschreibungBeweise } from "~/domains/geldEinklagen/formular/klage-erstellen/begruendung/components/SummaryOverviewBoxBegruendungBeschreibungBeweise";

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
      {title && (
        <Heading
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
      <dl>
        {boxItems.map(({ title: boxItemTitle, inlineItems }, index) => (
          <SummaryOverviewBoxItem
            // oxlint-disable-next-line react/no-array-index-key
            key={`${boxId}-${boxItemTitle ?? index}`}
            title={boxItemTitle}
            translations={translations}
            userData={userData}
            inlineItems={inlineItems}
            pathname={`${flowId}${stepId}`}
          />
        ))}
      </dl>

      {/* Workaround for TGA as this component is used in the Begründung
      Beschreibung Beweise section and we need to render the items here as well */}
      {flowId === "/geld-einklagen/formular" &&
        stepId.includes("/klage-erstellen/begruendung/beschreibung") && (
          <SummaryOverviewBoxBegruendungBeschreibungBeweise
            userData={userData}
          />
        )}
      <a
        href={`${flowId}${stepId}`}
        className="kern-link no-underline! hover:underline!"
      >
        <Icon name="edit" />
        Bearbeiten
      </a>
    </div>
  );
};

export default SummaryOverviewBox;
