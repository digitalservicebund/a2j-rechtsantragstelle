import { Icon } from "~/components/common/Icon";
import type { ArrayData } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { translations as translationProvider } from "~/services/translations/translations";
import ArraySummaryDataItems from "./ArraySummaryDataItem";
import { type HeadingProps } from "~/components/formElements/Heading";
import Button from "~/components/formElements/Button";
import RichText from "~/components/formElements/RichText";

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

const ArraySummary = ({ category, arrayData, content }: ArraySummaryProps) => {
  const nextItemIndex = String(arrayData.data.length);
  const { url, initialInputUrl, disableAddButton } = arrayData.configuration;

  return (
    <div className="flex flex-col gap-kern-space-default">
      {(content.title || content.description) && (
        <div className="flex flex-col gap-kern-space-default">
          {content.title?.text && (
            <h2 className="kern-title" id={content.title.elementId}>
              {content.title.text}
            </h2>
          )}
          {content.description && <RichText html={content.description} />}
        </div>
      )}

      {arrayData.data.map((items, index) => (
        <ArraySummaryDataItems
          // oxlint-disable-next-line react/no-array-index-key
          key={`${content.buttonLabel}_${index}`}
          configuration={arrayData.configuration}
          itemIndex={index}
          items={items}
          category={category}
          subtitle={content.subtitle}
          itemLabels={content.itemLabels}
        />
      ))}

      <div>
        <Button
          look="secondary"
          iconLeft={<Icon name="plus" className="text-kern-action-default" />}
          href={`${url}/${Number(nextItemIndex)}/${initialInputUrl}`}
          disabled={disableAddButton}
          data-testid={`add-${category}`}
        >
          {`${content.buttonLabel} ${translationProvider.arraySummary.arrayAddButtonLabel.de}`}
        </Button>
      </div>
    </div>
  );
};

export default ArraySummary;
