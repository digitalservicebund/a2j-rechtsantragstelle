import type { BasicTypes } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import ArraySummaryItemButton from "./ArraySummaryItemButton";
import KernHeading, {
  type KernHeadingProps,
} from "~/components/kern/KernHeading";

type ArraySummaryItemProps = {
  readonly itemIndex: number;
  readonly items: Record<string, BasicTypes>;
  readonly category: string;
  readonly configuration: ArrayConfigClient;
  readonly subtitle?: KernHeadingProps;
  readonly itemLabels: ItemLabels;
};

const ArraySummaryDataItems = ({
  itemIndex,
  items,
  category,
  configuration,
  subtitle,
  itemLabels,
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
      {heading && <KernHeading {...heading} />}

      {itemsWithoutHiddenFields.map(([itemKey, itemValue]) => (
        <div key={itemKey} className="first:pt-0 scroll-my-40">
          <KernHeading text={itemLabels[itemKey] ?? ""} tagName="p" />
          {itemLabels[`${itemKey}.${itemValue}`] ?? itemValue}
        </div>
      ))}
      <ArraySummaryItemButton
        {...(heading ? { heading } : null)}
        category={category}
        itemIndex={itemIndex}
        editUrl={`${url}/${itemIndex}/${initialInputUrl}`}
      />
    </div>
  );
};

export default ArraySummaryDataItems;
