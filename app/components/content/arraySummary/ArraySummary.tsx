import { Icon } from "~/components/common/Icon";
import type { ArrayData } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { translations as translationProvider } from "~/services/translations/translations";
import ArraySummaryDataItems from "./ArraySummaryDataItems";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import Button from "~/components/common/Button";
import RichText from "~/components/common/RichText";

type ArraySummaryProps = Readonly<{
  category: string;
  arrayData: {
    data: ArrayData;
    configuration: ArrayConfigClient;
  };
  content: {
    title?: HeadingProps;
    description?: string;
    buttonLabel: string;
    subtitle?: HeadingProps;
    itemLabels: ItemLabels;
  };
}>;

const ArraySummary = ({
  category,
  arrayData,
  content: { title, description, buttonLabel, subtitle, itemLabels },
}: ArraySummaryProps) => {
  const nextItemIndex = String(arrayData.data.length);
  const { url, initialInputUrl, disableAddButton } = arrayData.configuration;

  return (
    <div className="flex flex-col gap-kern-space-default">
      {(title || description) && (
        <div className="flex flex-col gap-kern-space-default">
          {title && (
            <Heading {...title} managedByParent className="kern-title" />
          )}
          {description && <RichText html={description} />}
        </div>
      )}

      {arrayData.data.map((items, index) => (
        <ArraySummaryDataItems
          // oxlint-disable-next-line react/no-array-index-key
          key={`${buttonLabel}_${index}`}
          configuration={arrayData.configuration}
          itemIndex={index}
          items={items}
          category={category}
          subtitle={subtitle}
          itemLabels={itemLabels}
        />
      ))}

      <div>
        <Button
          look="secondary"
          iconLeft={
            <Icon
              name="plus"
              className="text-kern-action-default forced-color-adjust-auto!"
            />
          }
          href={`${url}/${Number(nextItemIndex)}/${initialInputUrl}`}
          disabled={disableAddButton}
          data-testid={`add-${category}`}
        >
          {`${buttonLabel} ${translationProvider.arraySummary.arrayAddButtonLabel.de}`}
        </Button>
      </div>
    </div>
  );
};

export default ArraySummary;
