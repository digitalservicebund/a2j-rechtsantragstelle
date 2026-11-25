const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 100;

export const focusOnItem =
  (idPrefix: string, fallbackIdPrefix?: string) => (itemIndex: number) => {
    setTimeout(() => {
      const element =
        document.getElementById(`${idPrefix}${itemIndex - 1}`) ??
        document.getElementById(
          fallbackIdPrefix ? `${fallbackIdPrefix}-${itemIndex - 1}` : "",
        );
      element?.focus();
    }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
  };
