export type SelectOption = {
  id?: number;
  text: string;
  value: string;
};

export type FieldError = {
  code: string;
  text: string;
};

export type ErrorCategory = {
  id: number;
  attributes: {
    name: string;
    errorCodes: FieldError[];
  };
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
  errors: { data: ErrorCategory[] };
};

export type Button = {
  look?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "large" | "medium" | "small";
  fullWidth?: boolean;
  href?: string;
  text?: string;
};

export type FormComponentCMS = Input | Select;
