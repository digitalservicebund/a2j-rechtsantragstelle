import type { RefObject } from "react";
import { components, type ClearIndicatorProps } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { useTranslations } from "~/services/translations/translationsContext";

const AUTO_SUGGESTION_INPUT_BUTTON_ARIAL_KEY =
  "auto-suggestion-input-button-arial";

const CustomClearIndicator = (
  props: ClearIndicatorProps<DataListOptions, false>,
  buttonExclusionRef: RefObject<HTMLButtonElement>,
) => {
  const { accessibility: translations } = useTranslations();
  return (
    <button
      aria-label={getTranslationByKey(
        AUTO_SUGGESTION_INPUT_BUTTON_ARIAL_KEY,
        translations,
      )}
      ref={buttonExclusionRef}
      data-testid="clear-input-button"
      className="outline-none focus-visible:ring-blue-800 focus-visible:ring-4"
      onClick={() => {
        props.clearValue();
      }}
      tabIndex={0}
    >
      <components.ClearIndicator
        className="text-blue-800 hover:text-blue-300"
        {...props}
      />
    </button>
  );
};

export default CustomClearIndicator;
