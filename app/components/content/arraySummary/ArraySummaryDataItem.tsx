import { type BasicTypes } from "~/domains/userData";
import { type HighlightData } from "~/routes/action.save-highlight-text";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { HighlightableText } from "~/components/content/arraySummary/HighlightableText";

type Props = {
  readonly itemLabels: ItemLabels;
  readonly itemKey: string;
  readonly itemValue: BasicTypes;
  readonly category: string;
  readonly itemIndex: number;
  readonly highlightText?: Record<
    string,
    Record<number, Record<string, HighlightData>>
  >;
};

export const ArraySummaryDataItem = ({
  itemKey,
  itemLabels,
  itemValue,
  highlightText,
  category,
  itemIndex,
}: Props) => {
  const translationItem = itemLabels[`${itemKey}.${itemValue}`];

  if (translationItem) {
    return <div data-testid="withTranslation">{translationItem}</div>;
  }

  const highlights =
    highlightText?.[category]?.[itemIndex]?.[itemKey]?.highlightTexts ?? [];

  return (
    <div data-testid="withoutTranslation">
      {typeof itemValue === "string" ? (
        <HighlightableText
          text={itemValue}
          highlights={highlights}
          category={category}
          field={itemKey}
          arrayIndex={itemIndex}
        />
      ) : (
        itemValue
      )}
    </div>
  );
};
