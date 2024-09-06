const FONT_SIZE_10 = 10;
const FONT_SIZE_6 = 6;
const FONT_SIZE_8 = 8;
const FONT_SIZE_9 = 9;

export function getFontSizeFieldValue(fieldName: string): number {
  switch (fieldName) {
    case "F3-Bank1":
      return FONT_SIZE_9;
    case "E2-Geburtsdatum":
    case "E2-Geburtsdatum1":
    case "E2-Geburtsdatum2":
    case "E2-Geburtsdatum3":
    case "E2-Geburtsdatum4":
    case "G10-Belastungen":
    case "G2-1":
    case "G2-2":
    case "G2-3":
    case "G2-4":
    case "G3-1":
    case "G3-2":
    case "G3-3":
    case "G3-4":
      return FONT_SIZE_8;
    case "D3-Teilwohnkosten":
    case "E3-Familienverhältnis":
    case "E3-Familienverhältnis2":
    case "E3-Familienverhältnis3":
    case "E3-Familienverhältnis4":
    case "Monatliche Bruttoeinnahmen durch Selbstständige Arbeit in Euro3":
      return FONT_SIZE_6;
    default:
      return FONT_SIZE_10;
  }
}
