import ArraySummaryItemButton from "~/components/arraySummary/ArraySummaryItemButton";
import type { BasicTypes } from "~/flows/contexts";
import { WEITERE_PERSONEN_START_INDEX } from "~/flows/fluggastrechteFormular/stringReplacements";
import type { ArrayConfig } from "~/services/array";
import type { Translations } from "~/services/cms/index.server";
import { interpolateDeep } from "~/util/fillTemplate";
import { getTranslationByKey } from "~/util/getTranslationByKey";
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

const ArraySummaryDataItems = ({
  itemIndex,
  items,
  category,
  configuration,
  csrf,
  headingTitleTagNameItem,
  translations = {},
}: ArraySummaryItemProps) => {
  const { url, initialInputUrl, hiddenFields } = configuration;
  const itemsWithoutHiddenFields = Object.entries(items).filter(
    ([itemKey, itemValue]) => itemValue && !hiddenFields?.includes(itemKey),
  );

  if (itemsWithoutHiddenFields.length === 0) {
    return null;
  }

  const heading = interpolateDeep(
    translations[`${category}.label.heading`] ?? "",
    {
      indexPerson: (itemIndex + WEITERE_PERSONEN_START_INDEX).toString(),
      indexArbeitsausgabe: (itemIndex + 1).toString(),
      indexEinkunft: (itemIndex + 1).toString(),
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
        initialInputUrl={initialInputUrl}
        itemIndex={itemIndex}
        url={url}
        translations={translations}
        className="pt-8"
      />
    </div>
  );
};

export default ArraySummaryDataItems;
