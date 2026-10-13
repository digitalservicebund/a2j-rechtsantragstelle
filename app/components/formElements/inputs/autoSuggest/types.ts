import { type DataListType } from "~/services/validation/autoSuggest";
import { type ErrorMessageProps } from "../../../common/types";
import { type Size } from "../inputWidth";

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
  size?: Size;
}>;
