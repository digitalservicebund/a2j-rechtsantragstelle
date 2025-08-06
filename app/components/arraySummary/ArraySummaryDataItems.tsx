import ArraySummaryItemButton from "~/components/arraySummary/ArraySummaryItemButton";
import type { BasicTypes } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import Heading, { type HeadingProps } from "../Heading";

type ArraySummaryItemProps = {
  readonly itemIndex: number;
  readonly items: Record<string, BasicTypes>;
  readonly category: string;
  readonly configuration: ArrayConfigClient;
  readonly csrf: string;
  readonly subtitle?: HeadingProps;
  readonly itemsContent: Array<{ item: string; value: string }>;
};

const getItemTitle = (
  itemsContent: Array<{ item: string; value: string }>,
  itemKey: string,
) => {
  return itemsContent.find((item) => item.item === itemKey)?.value ?? itemKey;
};

const getItemValue = (
  itemsContent: Array<{ item: string; value: string }>,
  itemKey: string,
  itemValue: BasicTypes,
) => {
  return (
    itemsContent.find((item) => item.item === `${itemKey}.${itemValue}`)
      ?.value ?? itemValue
  );
};

const ArraySummaryDataItems = ({
  itemIndex,
  items,
  category,
  configuration,
  csrf,
  subtitle,
  itemsContent,
}: ArraySummaryItemProps) => {
  const { url, initialInputUrl, hiddenFields, displayIndexOffset } =
    configuration;
  const itemsWithoutHiddenFields = Object.entries(items).filter(
    ([itemKey, itemValue]) => itemValue && !hiddenFields?.includes(itemKey),
  );

  if (itemsWithoutHiddenFields.length === 0) {
    return null;
  }

  const heading = applyStringReplacement(
    subtitle ?? "",
    {
      indexArray: (itemIndex + (displayIndexOffset ?? 1)).toString(),
    },
    false,
  );

  return (
    <div className="space-y-16 bg-white p-16">
      {heading && <Heading {...heading} />}

      {itemsWithoutHiddenFields.map(([itemKey, itemValue]) => (
        <div key={itemKey} className="first:pt-0 scroll-my-40">
          <Heading
            dataTestid="array-summary-item"
            text={getItemTitle(itemsContent, itemKey)}
            tagName={"p"}
            look="ds-label-02-bold"
          />
          {getItemValue(itemsContent, itemKey, itemValue)}
        </div>
      ))}
      <ArraySummaryItemButton
        category={category}
        csrf={csrf}
        itemIndex={itemIndex}
        editUrl={`${url}/${itemIndex}/${initialInputUrl}`}
      />
    </div>
  );
};

export default ArraySummaryDataItems;
