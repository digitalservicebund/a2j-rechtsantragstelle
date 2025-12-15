import { useFetcher } from "react-router";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { SelectionTooltip } from "./SelectionTooltip";
import {
  getTextSelection,
  hasOverlap,
  isExactMatch,
  type TextSelection,
} from "~/components/content/arraySummary/textSelection";

type Highlight = {
  startOffset: number;
  endOffset: number;
};

type Props = {
  readonly text: string;
  readonly highlights: Highlight[];
  readonly category: string;
  readonly field: string;
  readonly arrayIndex: number;
};

export const HighlightableText = ({
  text,
  highlights,
  category,
  field,
  arrayIndex,
}: Props) => {
  const containerRef = useRef(null);
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [tooltipMode, setTooltipMode] = useState<
    "save" | "delete" | "disabled"
  >("save");
  const fetcher = useFetcher();

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!containerRef.current) return;

      const textSelection = getTextSelection(containerRef.current);

      if (!textSelection) {
        setSelection(null);
        return;
      }

      // Check if exact match (for deletion)
      if (
        isExactMatch(
          textSelection.startOffset,
          textSelection.endOffset,
          highlights,
        )
      ) {
        setSelection(textSelection);
        setTooltipMode("delete");
        return;
      }

      // Check for overlap (disabled)
      if (
        hasOverlap(
          textSelection.startOffset,
          textSelection.endOffset,
          highlights,
        )
      ) {
        setSelection(textSelection);
        setTooltipMode("disabled");
        return;
      }

      // Valid new selection
      setSelection(textSelection);
      setTooltipMode("save");
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [highlights]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  }, [fetcher.state, fetcher.data]);

  const handleAction = () => {
    if (!selection || tooltipMode === "disabled") return;

    const formData = new FormData();
    formData.append("action", tooltipMode);
    formData.append("arrayCategory", category);
    formData.append("field", field);
    formData.append("arrayIndex", String(arrayIndex));
    formData.append("startOffset", String(selection.startOffset));
    formData.append("endOffset", String(selection.endOffset));

    void fetcher.submit(formData, {
      method: "post",
      action: "/action/save-highlight-text",
    });
  };

  const renderContent = (): ReactNode => {
    // Filter out placeholder highlights
    const validHighlights = highlights.filter(
      (h) => h.startOffset !== -1 && h.endOffset !== -1,
    );

    if (validHighlights.length === 0) return text;

    const sortedHighlights = [...validHighlights].sort(
      (a, b) => a.startOffset - b.startOffset,
    );
    const result = [];
    let currentIndex = 0;

    for (const highlight of sortedHighlights) {
      if (currentIndex < highlight.startOffset) {
        result.push(
          <span key={`text-${currentIndex}`}>
            {text.slice(currentIndex, highlight.startOffset)}
          </span>,
        );
      }

      result.push(
        <mark
          key={`highlight-${highlight.startOffset}`}
          style={{ backgroundColor: "#fef08a" }}
        >
          {text.slice(highlight.startOffset, highlight.endOffset)}
        </mark>,
      );

      currentIndex = highlight.endOffset;
    }

    if (currentIndex < text.length) {
      result.push(
        <span key={`text-${currentIndex}`}>{text.slice(currentIndex)}</span>,
      );
    }

    return result;
  };

  return (
    <>
      <span ref={containerRef} style={{ userSelect: "text", cursor: "text" }}>
        {renderContent()}
      </span>

      {selection && (
        <SelectionTooltip
          position={{
            top: selection.rect.top,
            left: selection.rect.left + selection.rect.width / 2,
          }}
          mode={tooltipMode}
          onAction={handleAction}
        />
      )}
    </>
  );
};
