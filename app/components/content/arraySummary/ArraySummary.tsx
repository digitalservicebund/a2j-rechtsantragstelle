import AddButton from "@digitalservicebund/icons/Add";
import type { ArrayData } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { translations as translationProvider } from "~/services/translations/translations";
import ArraySummaryDataItems from "./ArraySummaryDataItems";
import KernButton from "~/components/kern/KernButton";
import KernHeading, {
  type KernHeadingProps,
} from "~/components/kern/KernHeading";
import KernRichText from "~/components/kern/KernRichText";

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
}>;

const ArraySummary = ({ category, arrayData, content }: ArraySummaryProps) => {
  const nextItemIndex = String(arrayData.data.length);
  const { url, initialInputUrl, disableAddButton } = arrayData.configuration;

  return (
    <div>
      <div className="ds-stack ds-stack-8">
        {content.title && <KernHeading {...content.title} />}
        {content.description && <KernRichText html={content.description} />}
        <div className="space-y-32">
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
          <KernButton
            look="primary"
            className={`hover:shadow-none ${
              disableAddButton ? "is-disabled pointer-events-none" : ""
            }`}
            iconLeft={<AddButton />}
            data-testid={`add-${category}`}
            href={`${url}/${Number(nextItemIndex)}/${initialInputUrl}`}
          >{`${content.buttonLabel} ${translationProvider.arraySummary.arrayAddButtonLabel.de}`}</KernButton>
        </div>
      </div>
    </div>
  );
};

export default ArraySummary;
