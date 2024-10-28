export interface BooleanField {
  name: string;
  value?: boolean;
}
export interface StringField {
  name: string;
  maxCharWidth: number;
  maxLines: number;
  value?: string;
}

type JsonField = BooleanField | StringField;

export function isBooleanField(field: JsonField): field is BooleanField {
  return typeof field.value === "boolean";
}
