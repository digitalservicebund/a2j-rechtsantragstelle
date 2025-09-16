import AddButton from "@digitalservicebund/icons/Add";
import Button from "~/components/common/Button";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText from "~/components/common/RichText";
import type { ArrayData } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { translations as translationProvider } from "~/services/translations/translations";
import ArraySummaryDataItems from "./ArraySummaryDataItems";

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
  csrf: string;
}>;

const ArraySummary = ({
  category,
  arrayData,
  csrf,
  content,
}: ArraySummaryProps) => {
  const nextItemIndex = String(arrayData.data.length);
  const { url, initialInputUrl, disableAddButton } = arrayData.configuration;

  return (
    <div>
      <div className="ds-stack ds-stack-8">
        {content.title && <Heading {...content.title} />}
        {content.description && <RichText html={content.description} />}
        <div className="space-y-32">
          {arrayData.data.map((items, index) => (
            <ArraySummaryDataItems
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
          <Button
            look="primary"
            size="small"
            className={`hover:shadow-none ${
              disableAddButton ? "is-disabled pointer-events-none" : ""
            }`}
            iconLeft={<AddButton />}
            data-testid={`add-${category}`}
            href={`${url}/${Number(nextItemIndex)}/${initialInputUrl}`}
          >{`${content.buttonLabel} ${translationProvider.arraySummary.arrayAddButtonLabel.de}`}</Button>
        </div>
      </div>
    </div>
  );
};

export default ArraySummary;
