export type TextSelection = {
  text: string;
  startOffset: number;
  endOffset: number;
  rect: DOMRect;
};

/**
 * Calculates the absolute character offset of a node within a container
 */
const getAbsoluteOffset = (
  container: Node,
  targetNode: Node,
  nodeOffset: number,
): number => {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let offset = 0;
  let currentNode: Node | null = walker.nextNode();

  while (currentNode) {
    if (currentNode === targetNode) {
      return offset + nodeOffset;
    }
    offset += currentNode.textContent?.length ?? 0;
    currentNode = walker.nextNode();
  }

  return offset;
};

/**
 * Extracts text selection data relative to a container element
 */
export const getTextSelection = (
  containerElement: HTMLElement,
): TextSelection | null => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);

  // Verify selection is within container
  if (!containerElement.contains(range.commonAncestorContainer)) {
    return null;
  }

  const text = range.toString().trim();
  if (!text) {
    return null;
  }

  const startOffset = getAbsoluteOffset(
    containerElement,
    range.startContainer,
    range.startOffset,
  );

  const endOffset = getAbsoluteOffset(
    containerElement,
    range.endContainer,
    range.endOffset,
  );

  return {
    text,
    startOffset,
    endOffset,
    rect: range.getBoundingClientRect(),
  };
};

/**
 * Checks if a selection overlaps with any existing highlights
 */
export const hasOverlap = (
  selectionStart: number,
  selectionEnd: number,
  highlights: Array<{ startOffset: number; endOffset: number }>,
) => {
  return highlights.some(({ startOffset, endOffset }) => {
    const startsInside =
      selectionStart > startOffset && selectionStart < endOffset;

    const endsInside = selectionEnd > startOffset && selectionEnd < endOffset;

    const fullyCovers =
      selectionStart < startOffset && selectionEnd > endOffset;

    return startsInside || endsInside || fullyCovers;
  });
};

/**
 * Checks if a selection exactly matches an existing highlight
 */
export const isExactMatch = (
  startOffset: number,
  endOffset: number,
  highlights: Array<{ startOffset: number; endOffset: number }>,
) => {
  return highlights.some(
    (highlight) =>
      highlight.startOffset === startOffset &&
      highlight.endOffset === endOffset,
  );
};
