import { getFontSizeFieldValue } from "~/services/pdf/getFontSizeFieldValue";

describe("getFontSizeFieldValue", () => {
  const casesFontSizes = [
    { input: "D3-Teilwohnkosten", expected: 6 },
    { input: "E2-Geburtsdatum", expected: 8 },
    { input: "E2-Geburtsdatum2", expected: 8 },
    { input: "E2-Geburtsdatum3", expected: 8 },
    { input: "E2-Geburtsdatum4", expected: 8 },
    { input: "E3-Familienverhältnis", expected: 6 },
    { input: "E3-Familienverhältnis2", expected: 6 },
    { input: "E3-Familienverhältnis3", expected: 6 },
    { input: "E3-Familienverhältnis4", expected: 6 },
    { input: "any_other_field", expected: 10 },
  ];

  test.each(casesFontSizes)(
    "should return font size $expected for field name $input",
    ({ input, expected }) => {
      const actual = getFontSizeFieldValue(input);
      expect(actual).toEqual(expected);
    },
  );
});
