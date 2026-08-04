import { type DataListType } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import { type ErrorMessageProps } from "../../../common/types";

export type AutoSuggestInputProps = Readonly<{
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessages?: ErrorMessageProps[];
  noSuggestionMessage?: string;
  dataList: DataListType;
  dataListArgument?: string;
  isDisabled: boolean;
  minSuggestCharacters?: number;
  supportsFreeText?: boolean;
  suffix?: string;
}>;
