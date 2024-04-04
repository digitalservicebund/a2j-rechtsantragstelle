const FONT_SIZE_10 = 10;
const FONT_SIZE_5 = 5;
const FONT_SIZE_6 = 6;
const FONT_SIZE_8 = 8;

export function getFontSizeFieldValue(fieldName: string): number {
  switch (fieldName) {
    case "D3-Teilwohnkosten":
      return FONT_SIZE_5;
    case "E2-Geburtsdatum":
    case "E2-Geburtsdatum1":
    case "E2-Geburtsdatum2":
    case "E2-Geburtsdatum3":
    case "E2-Geburtsdatum4":
      return FONT_SIZE_8;
    case "E3-Familienverhältnis":
    case "E3-Familienverhältnis2":
    case "E3-Familienverhältnis3":
    case "E3-Familienverhältnis4":
      return FONT_SIZE_6;
    default:
      return FONT_SIZE_10;
  }
}
