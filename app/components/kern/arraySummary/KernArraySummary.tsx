import KernButton from "~/components/kern/KernButton";
import KernRichText from "~/components/kern/KernRichText";
import { KernIcon } from "~/components/kern/common/KernIcon";
import type { ArrayData } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { translations as translationProvider } from "~/services/translations/translations";
import KernArraySummaryDataItems from "./KernArraySummaryDataItem";
import { type KernHeadingProps } from "../KernHeading";

type ArraySummaryProps = Readonly<{
  category: string;
  arrayData: {
    data: ArrayData;
    configuration: ArrayConfigClient;
  };
  content: {
    title?: KernHeadingProps;
    description?: string;
    buttonLabel: string;
    subtitle?: KernHeadingProps;
    itemLabels: ItemLabels;
  };
  csrf: string;
}>;

const KernArraySummary = ({
  category,
  arrayData,
  csrf,
  content,
}: ArraySummaryProps) => {
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
          {content.description && <KernRichText html={content.description} />}
        </div>
      )}

      {arrayData.data.map((items, index) => (
        <KernArraySummaryDataItems
          key={`${content.buttonLabel}_${index}`}
          configuration={arrayData.configuration}
          itemIndex={index}
          items={items}
          category={category}
          csrf={csrf}
          subtitle={content.subtitle}
          itemLabels={content.itemLabels}
        />
      ))}

      <div>
        <KernButton
          look="secondary"
          iconLeft={
            <KernIcon name="plus" className="text-kern-action-default" />
          }
          href={`${url}/${Number(nextItemIndex)}/${initialInputUrl}`}
          disabled={disableAddButton}
        >
          {`${content.buttonLabel} ${translationProvider.arraySummary.arrayAddButtonLabel.de}`}
        </KernButton>
      </div>
    </div>
  );
};

export default KernArraySummary;
