import type { FormatOptionLabelMeta } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

function escapeParentheses(string: string) {
  return string.replace(/[\\()]/g, "\\$&");
}

function splitHighlightWord(
  text: string | undefined,
  matchWord: string,
): string[] {
  if (typeof text === "undefined") {
    return [];
  }

  return text.split(new RegExp(`(${escapeParentheses(matchWord)})`, "gi"));
}

const renderHighlightText = (
  wordParts: string[],
  matchWord: string,
  testId: string,
) => {
  return wordParts.map((wordPart, index) =>
    wordPart.toLowerCase() === matchWord.toLowerCase() ? (
      // eslint-disable-next-line react/no-array-index-key
      <strong data-testid={testId} key={`${wordPart}-${index}`}>
        {wordPart}
      </strong>
    ) : (
      wordPart
    ),
  );
};

const FormatOptionLabel = (
  { label, subDescription }: DataListOptions,
  { context, inputValue }: FormatOptionLabelMeta<DataListOptions>,
) => {
  if (context === "value") {
    return <span className="focus:text-blue-100">{label}</span>;
  }

  const inputWithoutSpace = inputValue.trim();

  const labelParts = splitHighlightWord(label, inputWithoutSpace);
  const subDescriptionParts = splitHighlightWord(
    subDescription,
    inputWithoutSpace,
  );

  return (
    <div data-testid="auto-suggest-input-menu-item" style={{ flex: "10" }}>
      {renderHighlightText(
        labelParts,
        inputWithoutSpace,
        "suggestion-item-label-highlight",
      )}
      <div className="primary">
        {renderHighlightText(
          subDescriptionParts,
          inputWithoutSpace,
          "suggestion-item-subDescription-highlight",
        )}
      </div>
    </div>
  );
};

export default FormatOptionLabel;
