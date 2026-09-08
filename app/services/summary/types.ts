export type FieldItem = {
  id: string;
  // Optional heading rendered above the item. The summary shows it when present
  // and shows nothing otherwise.
  title?: string;
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
  // Full nested box key (e.g. "kinder-0-kinder-2"), distinguishing items at any depth
  arrayBoxKey?: string;
};

export type FieldOption = {
  text: string;
  value: string;
};

export type FieldQuestion = {
  question: string;
  options?: FieldOption[];
};

export type ArrayFieldSegment = {
  fieldName: string;
  arrayIndex: number;
};

export type ArrayFieldInfo = {
  baseFieldName: string;
  arrayIndex: number;
  subFieldName?: string;
  isArrayField: boolean;
  isArraySubField: boolean;
  segments: ArrayFieldSegment[];
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
