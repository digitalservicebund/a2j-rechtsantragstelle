import { faker } from "@faker-js/faker";
import type { AttachmentEntries } from "../attachment";
import { fillPdfField } from "../fillPdfField";

const field = (value?: string) => ({
  name: "name",
  maxCharacters: 13,
  maxLineBreaks: 1,
  value,
});

const defaultArgs = (value?: string) =>
  ({
    fieldname: "field",
    value,
    attachmentTitle: "attachmentTitle",
    pdfValues: { field: field() },
    attachment: [] as AttachmentEntries,
  }) as const;

describe("fillPdfField", () => {
  it("should fill in data into pdfValues", () => {
    expect(fillPdfField(defaultArgs("123"))).toStrictEqual({
      pdfValues: { field: field("123") },
      attachment: [],
    });
  });

  it("should spill over into attachment if necessary", () => {
    const value = faker.string.alpha(14);
    expect(fillPdfField(defaultArgs(value))).toStrictEqual({
      pdfValues: { field: field("Siehe Anhang") },
      attachment: [{ text: value, title: "attachmentTitle" }],
    });
  });

  it("should spill over into attachment if necessary with short hint", () => {
    const args = defaultArgs("12345");
    args.pdfValues.field.maxCharacters = 4;
    expect(fillPdfField(args)).toStrictEqual({
      pdfValues: { field: { ...field("s.A."), maxCharacters: 4 } },
      attachment: [{ text: "12345", title: "attachmentTitle" }],
    });
  });

  it("should handles missing value", () => {
    expect(fillPdfField(defaultArgs())).toStrictEqual({
      pdfValues: { field: field() },
      attachment: [],
    });
  });
});
