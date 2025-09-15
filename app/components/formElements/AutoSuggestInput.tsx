import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { matchSorter } from "match-sorter";
import { type RefObject, useEffect, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router";
import Select, { type InputActionMeta } from "react-select";
import Creatable from "react-select/creatable";
import { type AutoSuggestInputProps } from "~/components/formElements/autoSuggestInput/types";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type RootLoader } from "~/root";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import {
  ariaLiveMessages,
  screenReaderStatus,
} from "./autoSuggestInput/accessibilityConfig/ariaLiveMessages";
import {
  CustomClearIndicator,
  CustomControl,
  CustomValueContainer,
  CustomInput,
  customStyles,
  FormatOptionLabel,
} from "./autoSuggestInput/customComponents";
import useDataListOptions from "./autoSuggestInput/useDataListOptions";
import Input from "./Input";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { widthClassname } from "../common/width";

const MINIMUM_SEARCH_SUGGESTION_CHARACTERS = 3;
const AIRPORT_CODE_LENGTH = 3;
const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 10;

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
  buttonExclusionRef: RefObject<HTMLButtonElement | null>,
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

const AutoSuggestInput = ({
  name,
  label,
  placeholder,
  errorMessages,
  width,
  dataList,
  dataListArgument,
  noSuggestionMessage,
  isDisabled,
  minSuggestCharacters = MINIMUM_SEARCH_SUGGESTION_CHARACTERS,
  supportsFreeText: isCreatable = false,
}: AutoSuggestInputProps) => {
  const items = useDataListOptions(dataList, dataListArgument);
  const [currentItemValue, setCurrentItemValue] =
    useState<DataListOptions | null>();
  const field = useField(name);
  const { defaultValue } = field.getInputProps();
  const errorId = `${name}-error`;
  const hasError = (field.error()?.length ?? 0) > 0;
  const inputId = `input-${name}`;
  const buttonExclusionRef = useRef<HTMLButtonElement>(null);

  const jsAvailable = useJsAvailable();
  const [optionWasSelected, setOptionWasSelected] = useState(false);
  const [options, setOptions] = useState<DataListOptions[]>([]);
  const rootLoaderData = useRouteLoaderData<RootLoader>("root");

  const isRequired = !!errorMessages?.find((err) => err.code === "required");

  const onInputChange = (value: string, { action }: InputActionMeta) => {
    if (action === "input-change") {
      if (value.length < minSuggestCharacters) {
        setOptions([]);
        return;
      }
      let filteredOptions = items.filter((item) =>
        item.label.toLowerCase().includes(value.toLocaleLowerCase()),
      );

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
    let value = getDescriptionByValue(items, defaultValue);

    if (isCreatable && !value && defaultValue) {
      value = {
        value: defaultValue,
        label: defaultValue,
      };
    }

    setCurrentItemValue(value);
  }, [defaultValue, items, isCreatable]);

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

  const SelectComponent = isCreatable ? Creatable : Select;

  return (
    <div
      data-testid={items.length > 0 ? `${inputId}-loaded` : ""}
      className="w-full"
    >
      {label && <InputLabel id={inputId}>{label}</InputLabel>}
      <SelectComponent
        aria-describedby={field.error() && errorId}
        aria-invalid={field.error() !== null}
        {...(isCreatable && {
          formatCreateLabel: (creatableValue) => creatableValue,
        })}
        ariaLiveMessages={ariaLiveMessages(
          rootLoaderData?.accessibilityTranslations,
        )}
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
        noOptionsMessage={({ inputValue }) =>
          inputValue.length > 2 ? noSuggestionMessage : null
        }
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
        screenReaderStatus={screenReaderStatus(
          rootLoaderData?.accessibilityTranslations,
        )}
        styles={customStyles(hasError)}
        tabIndex={0}
        value={currentItemValue}
      />

      <InputError id={errorId} keepAriaLive={false}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default AutoSuggestInput;
