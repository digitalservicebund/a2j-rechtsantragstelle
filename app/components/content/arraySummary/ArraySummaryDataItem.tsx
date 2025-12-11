import { type ReactNode } from "react";
import { type BasicTypes } from "~/domains/userData";
import { type HighlightData } from "~/routes/action.save-highlight-text";
import { type ItemLabels } from "~/services/array/getArraySummaryData";

type HighlightEntry = {
  startOffset: number;
  endOffset: number;
};

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

const getHighlighted = (
  text: string,
  category: string,
  itemIndex: number,
  itemKey: string,
  highlightText?: Record<string, Record<number, Record<string, HighlightData>>>,
): Array<string | ReactNode> => {
  const highlightEntries: HighlightEntry[] =
    highlightText?.[category]?.[itemIndex]?.[itemKey]?.highlightTexts ?? [];

  if (highlightEntries.length === 0) return [text];

  const result: Array<string | ReactNode> = [];
  let currentIndex = 0;

  highlightEntries.forEach(({ startOffset, endOffset }) => {
    // Add normal text before highlight
    if (currentIndex < startOffset) {
      result.push(text.slice(currentIndex, startOffset));
    }

    // Add highlighted segment
    result.push(
      <mark key={`${category}_${itemKey}_${startOffset}_${endOffset}`}>
        {text.slice(startOffset, endOffset)}
      </mark>,
    );

    currentIndex = endOffset;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    result.push(text.slice(currentIndex));
  }

  return result;
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
    return <p data-testid="withTranslation">{translationItem}</p>;
  }

  return (
    <p data-testid="withoutTranslation">
      {typeof itemValue === "string"
        ? getHighlighted(itemValue, category, itemIndex, itemKey, highlightText)
        : itemValue}
    </p>
  );
};
