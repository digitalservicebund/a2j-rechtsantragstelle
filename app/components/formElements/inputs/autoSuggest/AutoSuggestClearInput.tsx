import classNames from "classnames";
import type { RefObject } from "react";
import { useRouteLoaderData } from "react-router";
import type { ClearIndicatorProps } from "react-select";
import { Icon } from "~/components/common/Icon";
import { type RootLoader } from "~/root";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";

const AUTO_SUGGESTION_INPUT_BUTTON_ARIAL_KEY =
  "auto-suggestion-input-button-arial";

const AutoSuggestClearInput = (
  props: ClearIndicatorProps<DataListOptions, false>,
  buttonExclusionRef: RefObject<HTMLButtonElement | null>,
) => {
  const rootLoaderData = useRouteLoaderData<RootLoader>("root");
  return (
    <button
      aria-label={getTranslationByKey(
        AUTO_SUGGESTION_INPUT_BUTTON_ARIAL_KEY,
        rootLoaderData?.accessibilityTranslations,
      )}
      ref={buttonExclusionRef}
      data-testid="clear-input-button"
      /**
       *  default button type is "submit", which captures enter key press anywhere on page,
       *  erronously clearing the AutoSuggest
       */
      type="reset"
      className={classNames(
        "outline-none rounded-[var(--kern-metric-border-radius-default)]",
        "focus-visible:shadow-[0_0_0_2px_var(--kern-color-action-default-contextual),0_0_0_2px_var(--kern-color-action-default-contextual),0_0_0_2px_var(--kern-color-action-default-contextual)]",
        "hover:shadow-[0_0_0_2px_var(--kern-color-layout-border-contextual),0_0_0_2px_var(--kern-color-layout-border-contextual),0_0_0_2px_var(--kern-color-layout-border-contextual)]",
        "forced-color-adjust-none",
      )}
      onClick={() => {
        props.clearValue();
      }}
      onTouchStart={() => {
        props.clearValue();
      }}
      tabIndex={0}
    >
      <Icon name="close" className="text-blue-800" />
    </button>
  );
};

export default AutoSuggestClearInput;
