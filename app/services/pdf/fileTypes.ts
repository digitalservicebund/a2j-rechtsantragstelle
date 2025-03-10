export type BooleanField = {
  name: string;
  value?: boolean;
};
export type StringField = {
  name: string;
  value?: string;
  maxCharacters: number;
  maxLineBreaks: number;
};

type JsonField = BooleanField | StringField;

export type PdfValues = Record<string, JsonField>;

export function isBooleanField(field: JsonField): field is BooleanField {
  return typeof field.value === "boolean";
}
