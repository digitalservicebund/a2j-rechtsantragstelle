export type SelectOption = {
  id?: number;
  text: string;
  value: string;
};

export type FieldError = {
  code: string;
  text: string;
};

export type Select = {
  id: number;
  __component: "form-elements.select";
  name: string;
  label?: string;
  options: SelectOption[];
};

export type Input = {
  id: number;
  __component: "form-elements.input";
  name: string;
  label?: string;
  type: "text" | "number";
  errors: FieldError[];
};

export type FormComponent = Input | Select;
