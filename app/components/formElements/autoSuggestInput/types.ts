import { type DataListType } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import { type ErrorMessageProps } from "../../common/types";
import { type FieldWidth } from "../../common/width";

export type AutoSuggestInputProps = Readonly<{
  name: string;
  label?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: FieldWidth;
  noSuggestionMessage?: string;
  dataList: DataListType;
  dataListArgument?: string;
  isDisabled: boolean;
  minSuggestCharacters?: number;
  supportsFreeText?: boolean;
}>;
