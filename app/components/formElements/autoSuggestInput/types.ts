import { type DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import { type ErrorMessageProps } from "..";
import { type FieldWidth } from "../width";

export type AutoSuggestInputProps = Readonly<{
  name: string;
  label?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: FieldWidth;
  noSuggestionMessage?: string;
  dataList: DataListType;
  isDisabled: boolean;
  minSuggestCharacters?: number;
  supportsFreeText?: boolean;
}>;
