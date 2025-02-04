import {
  AriaGuidanceProps,
  AriaOnChangeProps,
  AriaOnFilterProps,
  AriaOnFocusProps,
  GroupBase,
  OptionsOrGroups,
} from "react-select";
import {
  getTranslationByKey,
  type Translations,
} from "~/services/translations/getTranslationByKey";
import {
  GUIDANCE_MENU_BASE,
  GUIDANCE_MENU_TAB_SELECTS_VALUE,
  GUIDANCE_INPUT_ARIA_LABEL_FALLBACK,
  GUIDANCE_INPUT_BASE,
  GUIDANCE_INPUT_IS_SEARCHABLE,
  GUIDANCE_INPUT_OPEN_MENU,
  GUIDANCE_VALUE,
  ON_CHANGE_DESELECTED,
  ON_CHANGE_CLEAR,
  ON_CHANGE_INITIAL_INPUT_FOCUS_PLURAL,
  ON_CHANGE_INITIAL_INPUT_FOCUS_SINGULAR,
  ON_CHANGE_SELECT_OPTION_DISABLED,
  ON_CHANGE_SELECT_OPTION_ENABLED,
  ARRAY_INDEX_FORMAT,
  ON_FOCUS_VALUE,
  ON_FOCUS_MENU_SELECTED,
  ON_FOCUS_MENU_DISABLED,
  ON_FOCUS_MENU_BASE,
  ON_FILTER_INPUT_PART,
  SCREEN_READER_STATUS,
} from "./ariaTranslationKeys";

export const ariaLiveMessages = (translations: Translations) => ({
  guidance: (props: AriaGuidanceProps) => {
    const { isSearchable, tabSelectsValue, context, isInitialFocus } = props;

    switch (context) {
      case "menu": {
        let message = getTranslationByKey(GUIDANCE_MENU_BASE, translations);
        if (tabSelectsValue) {
          message += getTranslationByKey(
            GUIDANCE_MENU_TAB_SELECTS_VALUE,
            translations,
          );
        }
        message += ".";
        return message;
      }

      case "input": {
        if (!isInitialFocus) return "";

        const ariaLabel =
          props["aria-label"] ??
          getTranslationByKey(GUIDANCE_INPUT_ARIA_LABEL_FALLBACK, translations);
        let message = getTranslationByKey(
          GUIDANCE_INPUT_BASE,
          translations,
        ).replace("{{ariaLabel}}", ariaLabel);

        if (isSearchable) {
          message += getTranslationByKey(
            GUIDANCE_INPUT_IS_SEARCHABLE,
            translations,
          );
        }

        message += getTranslationByKey(GUIDANCE_INPUT_OPEN_MENU, translations);

        return message;
      }

      case "value":
        return getTranslationByKey(GUIDANCE_VALUE, translations);

      default:
        return "";
    }
  },

  onChange: <Option, IsMulti extends boolean>(
    props: AriaOnChangeProps<Option, IsMulti>,
  ) => {
    const { action, label = "", labels, isDisabled } = props;
    switch (action) {
      case "pop-value":
      case "remove-value": {
        const message = getTranslationByKey(ON_CHANGE_DESELECTED, translations);
        return message.replace("{{label}}", label);
      }
      case "clear":
        return getTranslationByKey(ON_CHANGE_CLEAR, translations);
      case "initial-input-focus": {
        const labelsJoined = labels.join(", ");
        const key =
          labels.length > 1
            ? ON_CHANGE_INITIAL_INPUT_FOCUS_PLURAL
            : ON_CHANGE_INITIAL_INPUT_FOCUS_SINGULAR;
        const message = getTranslationByKey(key, translations);
        return message.replace("{{labels}}", labelsJoined);
      }
      case "select-option": {
        if (isDisabled) {
          const message = getTranslationByKey(
            ON_CHANGE_SELECT_OPTION_DISABLED,
            translations,
          );
          return message.replace("{{label}}", label);
        } else {
          const message = getTranslationByKey(
            ON_CHANGE_SELECT_OPTION_ENABLED,
            translations,
          );
          return message.replace("{{label}}", label);
        }
      }
      default:
        return "";
    }
  },

  onFocus: <Option, Group extends GroupBase<Option>>(
    props: AriaOnFocusProps<Option, Group>,
  ) => {
    const {
      context,
      focused,
      options,
      label = "",
      selectValue,
      isDisabled,
      isSelected,
      isAppleDevice,
    } = props;

    const getArrayIndex = (
      array: OptionsOrGroups<Option, Group>,
      item: Option,
    ) => {
      if (array?.length) {
        const currentIndex = array.indexOf(item) + 1;
        const totalCount = array.length;
        const format = getTranslationByKey(ARRAY_INDEX_FORMAT, translations);
        return format
          .replace("{{currentIndex}}", currentIndex.toString())
          .replace("{{totalCount}}", totalCount.toString());
      } else {
        return "";
      }
    };

    if (context === "value" && selectValue) {
      const index = getArrayIndex(selectValue, focused);
      const message = getTranslationByKey(ON_FOCUS_VALUE, translations);
      return message.replace("{{label}}", label).replace("{{index}}", index);
    }

    if (context === "menu" && isAppleDevice) {
      const statusParts = [];
      if (isSelected) {
        statusParts.push(
          getTranslationByKey(ON_FOCUS_MENU_SELECTED, translations),
        );
      }
      if (isDisabled) {
        statusParts.push(
          getTranslationByKey(ON_FOCUS_MENU_DISABLED, translations),
        );
      }
      const status = statusParts.join("");
      const index = getArrayIndex(options, focused);
      const messageBase = getTranslationByKey(ON_FOCUS_MENU_BASE, translations);
      return messageBase
        .replace("{{label}}", label)
        .replace("{{status}}", status)
        .replace("{{index}}", index);
    }
    return "";
  },

  onFilter: (props: AriaOnFilterProps) => {
    const { inputValue, resultsMessage } = props;
    const inputPart = inputValue
      ? getTranslationByKey(ON_FILTER_INPUT_PART, translations).replace(
          "{{inputValue}}",
          inputValue,
        )
      : "";
    return `${resultsMessage}${inputPart}.`;
  },
});

// **Updated screenReaderStatus Function**
export const screenReaderStatus =
  (translations: Translations) =>
  ({ count }: { count: number }) => {
    const message = getTranslationByKey(SCREEN_READER_STATUS, translations);
    const optionsText = count !== 1 ? "en" : "";
    return message
      .replace("{{count}}", count.toString())
      .replace("{{options}}", optionsText);
  };
