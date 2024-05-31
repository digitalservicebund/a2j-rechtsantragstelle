export interface BooleanField {
  name: string;
  value?: boolean;
}
export interface StringField {
  name: string;
  value?: string;
}

type JsonField = BooleanField | StringField;

export function isBooleanField(field: JsonField): field is BooleanField {
  return typeof field.value === "boolean";
}
