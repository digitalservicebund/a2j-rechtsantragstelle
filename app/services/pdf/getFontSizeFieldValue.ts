const FONT_SIZE_10 = 10;
const FONT_SIZE_5 = 5;

export function getFontSizeFieldValue(fieldName: string): number {
  if (fieldName === "D3-Teilwohnkosten") {
    return FONT_SIZE_5;
  }
  return FONT_SIZE_10;
}
