import type { BasicTypes } from "~/flows/contexts";
import type { ArrayConfig } from "~/services/array";
import type { Translations } from "~/services/cms/index.server";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import ArraySummaryItemButton from "./ArraySummaryItemButton";
import Heading from "../Heading";

type ArraySummaryItemProps = {
  readonly itemIndex: number;
  readonly items: Record<string, BasicTypes>;
  readonly category: string;
  readonly configuration: ArrayConfig;
  readonly headingTitleTagNameItem: "h2" | "h3";
  readonly csrf: string;
  readonly translations?: Translations;
};

const ArraySummaryItem = ({
  itemIndex,
  items,
  category,
  configuration,
  csrf,
  headingTitleTagNameItem,
  translations = {},
}: ArraySummaryItemProps) => {
  const { url, initialInputUrl, hiddenFields } = configuration;

  return (
    <div className="space-y-16 bg-white p-16">
      {Object.entries(items)
        .filter(
          ([itemKey, itemValue]) =>
            itemValue && !hiddenFields?.includes(itemKey),
        )
        .map(([itemKey, itemValue]) => (
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
        initialInputUrl={initialInputUrl}
        itemIndex={itemIndex}
        url={url}
        translations={translations}
      />
    </div>
  );
};

export default ArraySummaryItem;
