import AddButton from "@digitalservicebund/icons/Add";
import type { ArrayData } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { translations as translationProvider } from "~/services/translations/translations";
import ArraySummaryDataItems from "./ArraySummaryDataItems";
import Button from "../Button";
import Heading, { type HeadingProps } from "../Heading";
import RichText from "../RichText";

type ArraySummaryProps = {
  readonly category: string;
  readonly arrayData: {
    data: ArrayData;
    configuration: ArrayConfigClient;
  };
  readonly content: {
    readonly title?: HeadingProps;
    readonly description?: string;
    readonly buttonLabel?: string;
    readonly subtitle?: HeadingProps;
    readonly items: Array<{ item: string; value: string }>;
  };
  readonly csrf: string;
};

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
        {content.title && (
          <Heading dataTestid="array-summary-title" {...content.title} />
        )}
        {content.description && <RichText html={content.description} />}
        <div className="space-y-32">
          {arrayData.data.map((items, index) => (
            <ArraySummaryDataItems
              // eslint-disable-next-line react/no-array-index-key
              key={`${content.buttonLabel}_${index}`}
              configuration={arrayData.configuration}
              itemIndex={index}
              items={items}
              category={category}
              csrf={csrf}
              subtitle={content.subtitle}
              itemsContent={content.items}
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
