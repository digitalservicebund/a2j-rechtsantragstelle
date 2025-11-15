export type FieldItem = {
  id: string;
  question: string;
  answer: string;
  editUrl?: string;
  multipleQuestions?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  isArrayItem?: boolean;
  arrayIndex?: number;
  arrayBaseField?: string;
};

export type FieldOption = {
  text: string;
  value: string;
};

export type FieldQuestion = {
  question: string;
  options?: FieldOption[];
};

export type ArrayFieldInfo = {
  baseFieldName: string;
  arrayIndex: number;
  subFieldName?: string;
  isArrayField: boolean;
  isArraySubField: boolean;
};

export type ArrayGroup = {
  id?: string | number;
  title: string;
  items: FieldItem[];
};

export type SummaryItem = {
  id?: string | number;
  title: string;
  fields: FieldItem[];
  arrayGroups?: ArrayGroup[];
};
