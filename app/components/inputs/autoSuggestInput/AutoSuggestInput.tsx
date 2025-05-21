import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { matchSorter } from "match-sorter";
import { type RefObject, useEffect, useRef, useState } from "react";
import Select, { type InputActionMeta } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { useTranslations } from "~/services/translations/translationsContext";
import { useJsAvailable } from "~/services/useJsAvailable";
import {
  CustomClearIndicator,
  CustomControl,
  CustomValueContainer,
  CustomInput,
  customStyles,
  FormatOptionLabel,
} from "./customComponents";
import useDataListOptions from "./useDataListOptions";
import Input from "../Input";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import { widthClassname } from "../width";
import {
  ariaLiveMessages,
  screenReaderStatus,
} from "./accessibilityConfig/ariaLiveMessages";
import { type AutoSuggestInputProps } from "./types";

const MINIMUM_SEARCH_SUGGESTION_CHARACTERS = 3;
const AIRPORT_CODE_LENGTH = 3;
const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 10;

const filterOption = (option: DataListOptions, inputValue: string) => {
  if (inputValue.length < MINIMUM_SEARCH_SUGGESTION_CHARACTERS) {
    return false;
  }
  return option.label.toLowerCase().includes(inputValue.toLocaleLowerCase());
};

function getDescriptionByValue(
  dataListOptions: DataListOptions[],
  value: string,
): DataListOptions | null {
  return (
    dataListOptions.find((dataOption) => dataOption.value === value) ?? null
  );
}

const focusOnInput = (inputId: string) => {
  setTimeout(function () {
    const inputElement = document.querySelector<HTMLInputElement>(
      `#${inputId}`,
    );

    if (inputElement) {
      inputElement.focus();
    }
  }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
};

// When leave the input, it should focus on the exclusion button when it uses the tab, due problems for change the className in the component CustomValueContainer
const keyDownOnInput = (
  inputId: string,
  buttonExclusionRef: RefObject<HTMLButtonElement>,
) => {
  const inputElement = document.querySelector<HTMLInputElement>(`#${inputId}`);

  if (inputElement) {
    inputElement.addEventListener("keydown", function (event: KeyboardEvent) {
      // Only tab without shiftKey
      if (event.key === "Tab" && !event.shiftKey) {
        setTimeout(function () {
          if (buttonExclusionRef.current !== null) {
            buttonExclusionRef.current.focus();
          }
        }, 100);
      }
    });
  }
};

const getSortingAirportsByCode = (
  filteredOptions: DataListOptions[],
  inputCode: string,
): DataListOptions[] => {
  if (inputCode.length === AIRPORT_CODE_LENGTH) {
    return matchSorter(filteredOptions, inputCode, {
      keys: ["value", "subDescription"],
      threshold: matchSorter.rankings.NO_MATCH,
    });
  }

  return filteredOptions;
};

const getAriaDescribedById = (
  errorId: string,
  noOptionMessageId: string,
  hasError: boolean,
  hasOption: boolean,
) => {
  if (hasError) {
    return errorId;
  }

  if (hasOption) {
    return noOptionMessageId;
  }

  return undefined;
};

const AutoSuggestInput = ({
  name,
  label,
  placeholder,
  errorMessages,
  width,
  dataList,
  noSuggestionMessage,
  isDisabled,
}: AutoSuggestInputProps) => {
  const items = useDataListOptions(dataList);
  const [currentItemValue, setCurrentItemValue] =
    useState<DataListOptions | null>();
  const field = useField(name);
  const { defaultValue } = field.getInputProps();
  const errorId = `${name}-error`;
  const hasError = (field.error()?.length ?? 0) > 0;
  const inputId = `input-${name}`;
  const noOptionMessageId = `${name}-no-option-message`;
  const buttonExclusionRef = useRef<HTMLButtonElement>(null);

  const jsAvailable = useJsAvailable();
  const [optionWasSelected, setOptionWasSelected] = useState(false);
  const [options, setOptions] = useState<DataListOptions[]>([]);
  const { accessibility: translations } = useTranslations();

  const isRequired = !!errorMessages?.find((err) => err.code === "required");
  const [hasOptions, setHasOptions] = useState<boolean>(false);

  const onInputChange = (value: string, { action }: InputActionMeta) => {
    if (action === "input-change") {
      if (value.length < MINIMUM_SEARCH_SUGGESTION_CHARACTERS) {
        setOptions([]);
        setHasOptions(false);
        return;
      }
      setHasOptions(true);
      let filteredOptions = items.filter((item) => filterOption(item, value));

      // In case is the airports list, sorting by the code
      if (dataList === "airports") {
        filteredOptions = getSortingAirportsByCode(filteredOptions, value);
      }

      setOptions(filteredOptions);
    }
  };

  useEffect(() => {
    keyDownOnInput(inputId, buttonExclusionRef);
  });

  useEffect(() => {
    const value = getDescriptionByValue(items, defaultValue);

    setCurrentItemValue(value);
  }, [defaultValue, items]);

  const ariaDescribedById = getAriaDescribedById(
    errorId,
    noOptionMessageId,
    hasError,
    hasOptions,
  );

  // In case user does not have Javascript, it should render the Input as suggestion input
  if (!jsAvailable) {
    return (
      <Input
        name={name}
        label={label}
        placeholder={placeholder}
        width={width}
        errorMessages={errorMessages}
      />
    );
  }

  return (
    <div data-testid={items.length > 0 ? `${inputId}-loaded` : ""}>
      {label && <InputLabel id={inputId}>{label}</InputLabel>}
      <Select
        aria-describedby={ariaDescribedById}
        aria-errormessage={ariaDescribedById}
        aria-invalid={ariaDescribedById !== undefined}
        ariaLiveMessages={ariaLiveMessages(translations)}
        className={classNames(
          "w-full forced-colors:border-2",
          { "has-error": field.error() },
          { "option-was-selected": optionWasSelected },
          { "auto-suggest-input-disabled": isDisabled },
          { "auto-suggest-input-required": isRequired },
          widthClassname(width),
        )}
        components={{
          ClearIndicator: (props) =>
            CustomClearIndicator(props, buttonExclusionRef),
          Control: CustomControl,
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Input: CustomInput,
          ValueContainer: CustomValueContainer,
        }}
        filterOption={() => true}
        formatOptionLabel={FormatOptionLabel}
        id={name}
        inputId={inputId}
        instanceId={name}
        isClearable={!isDisabled}
        isSearchable={!isDisabled}
        menuShouldScrollIntoView
        name={name}
        noOptionsMessage={({ inputValue }) => {
          return inputValue.length > 2 ? (
            <span aria-live="assertive" id={ariaDescribedById}>
              {" "}
              {noSuggestionMessage}{" "}
            </span>
          ) : null;
        }}
        onBlur={() => {
          // call the validation only if an option was selected
          if (optionWasSelected) {
            setOptionWasSelected(false);

            if (hasError) {
              field.validate();
            }
          }
        }}
        onChange={(newValue, { action }) => {
          // remix remove the focus on the input when clicks with the keyboard to clear the value, so we need to force the focus again
          setOptionWasSelected(action === "select-option");
          if (action === "clear" || action === "select-option") {
            focusOnInput(inputId);
            // TODO: check later why the field.validate() is validating all the fields in the form
            if (hasError) {
              field.validate();
            }
          }
          setCurrentItemValue(newValue);
        }}
        onInputChange={onInputChange}
        options={options}
        placeholder={placeholder ?? ""}
        screenReaderStatus={screenReaderStatus(translations)}
        styles={customStyles(hasError)}
        tabIndex={isDisabled ? -1 : 0}
        value={currentItemValue}
      />

      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default AutoSuggestInput;
