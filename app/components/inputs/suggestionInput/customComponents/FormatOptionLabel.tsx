import { FormatOptionLabelMeta } from "react-select";
import { DataListOptions } from "../SuggestionInput";

function splitHighlightWord(
  text: string | undefined,
  matchWord: string,
): string[] {
  if (typeof text === "undefined") {
    return [];
  }

  return text.split(new RegExp(`(${matchWord})`, "gi"));
}

const renderHighlightText = (
  wordParts: string[],
  matchWord: string,
  testId: string,
) => {
  return wordParts.map((wordPart, index) =>
    wordPart.toLowerCase() === matchWord.toLowerCase() ? (
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

  const labelParts = splitHighlightWord(label, inputValue);
  const subDescriptionParts = splitHighlightWord(subDescription, inputValue);

  return (
    <div data-testid="suggestion-input-menu-item" style={{ flex: "10" }}>
      {renderHighlightText(
        labelParts,
        inputValue,
        "suggestion-item-label-highlight",
      )}
      <div className="primary">
        {renderHighlightText(
          subDescriptionParts,
          inputValue,
          "suggestion-item-subDescription-highlight",
        )}
      </div>
    </div>
  );
};

export default FormatOptionLabel;
