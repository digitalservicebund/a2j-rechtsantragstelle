import ArraySummaryItemButton from "~/components/arraySummary/ArraySummaryItemButton";
import type { BasicTypes } from "~/domains/contexts";
import type { ArrayConfigClient } from "~/services/array";
import {
  extractTranslations,
  getTranslationByKey,
  type Translations,
} from "~/services/translations/getTranslationByKey";
import { interpolateSerializableObject } from "~/util/fillTemplate";
import Heading from "../Heading";

type ArraySummaryItemProps = {
  readonly itemIndex: number;
  readonly items: Record<string, BasicTypes>;
  readonly category: string;
  readonly configuration: ArrayConfigClient;
  readonly headingTitleTagNameItem: "h2" | "h3";
  readonly csrf: string;
  readonly translations?: Translations;
};

const ArraySummaryDataItems = ({
  itemIndex,
  items,
  category,
  configuration,
  csrf,
  headingTitleTagNameItem,
  translations = {},
}: ArraySummaryItemProps) => {
  const { url, initialInputUrl, hiddenFields, displayIndexOffset } =
    configuration;
  const itemsWithoutHiddenFields = Object.entries(items).filter(
    ([itemKey, itemValue]) => itemValue && !hiddenFields?.includes(itemKey),
  );

  if (itemsWithoutHiddenFields.length === 0) {
    return null;
  }

  const heading = interpolateSerializableObject(
    translations[`${category}.label.heading`] ?? "",
    {
      indexArray: (itemIndex + (displayIndexOffset ?? 1)).toString(),
    },
  );

  return (
    <div className="space-y-16 bg-white p-16">
      {heading.trim().length > 0 && (
        <Heading text={heading} tagName="p" look="ds-heading-03-bold" />
      )}

      {itemsWithoutHiddenFields.map(([itemKey, itemValue]) => (
        <div key={itemKey} className="first:pt-0 scroll-my-40">
          <Heading
            dataTestid="array-summary-item"
            text={getTranslationByKey(`${category}.${itemKey}`, translations)}
            tagName={headingTitleTagNameItem}
            look="ds-label-02-bold"
          />
          {translations[`${category}.${itemKey}.${String(itemValue)}`] ??
            itemValue}
        </div>
      ))}
      <ArraySummaryItemButton
        category={category}
        csrf={csrf}
        itemIndex={itemIndex}
        editUrl={`${url}/${itemIndex}/${initialInputUrl}`}
        translations={extractTranslations(
          ["arrayEditButtonLabel", "arrayDeleteButtonLabel"],
          translations,
        )}
      />
    </div>
  );
};

export default ArraySummaryDataItems;
