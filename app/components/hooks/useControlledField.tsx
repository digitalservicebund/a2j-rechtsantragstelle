import { useField, useFormContext } from "@rvf/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { bankNameFromIBAN } from "~/components/formElements/inputs/iban/bankNameFromIBAN";
import { useBankData } from "~/components/formElements/inputs/iban/useBankData";
import { type AllowedUserTypes } from "~/domains/userData";

export const useControlledField = (
  fieldName: string,
  controlledFieldName: string,
) => {
  const field = useField<AllowedUserTypes>(fieldName);
  const fieldValue = field.value();
  const originalFieldValue = useRef(fieldValue).current;
  const form = useFormContext<any>();
  const controlledField = form?.field(controlledFieldName);
  const banks = useBankData(); // TODO: generalize!
  const [controlledFieldSrValue, setControlledFieldSrValue] =
    useState<string>();

  // TODO: generalize hook!
  useEffect(() => {
    // needed to ensure value isn't automatically set upon initial render
    if (originalFieldValue !== fieldValue) {
      if (
        fieldValue &&
        typeof fieldValue === "string" &&
        fieldValue.length > 0 &&
        banks
      ) {
        // Debounce needed to not clobber the screen reader while typing
        const timeout = setTimeout(() => {
          const matchedBankName = bankNameFromIBAN(fieldValue, banks);
          if (matchedBankName) {
            setControlledFieldSrValue(matchedBankName);
            controlledField.setValue(matchedBankName);
            controlledField.validate();
          } else {
            setControlledFieldSrValue("");
            controlledField.setValue("");
          }
        }, 1000);

        return () => clearTimeout(timeout);
      }
      setControlledFieldSrValue("");
      controlledField?.setValue("");
    }
  }, [fieldValue, controlledField, originalFieldValue, banks]);

  const MemoizedScreenreaderAnnouncement = useMemo(
    () =>
      ScreenreaderAnnouncement(
        `Bank identifiziert: ${controlledFieldSrValue}`, // TODO: generalize!
        controlledFieldSrValue,
      ),
    [controlledFieldSrValue],
  );

  return {
    SrAnnouncementComponent: MemoizedScreenreaderAnnouncement,
  };
};

/**
 * Screenreader-only element used to read out controlled field changes
 */
function ScreenreaderAnnouncement(
  srText: string,
  controlledFieldSrValue?: string,
) {
  return (
    <div
      aria-live="polite"
      aria-relevant="all"
      aria-atomic="true"
      className="sr-only"
    >
      <span key={controlledFieldSrValue}>
        {controlledFieldSrValue && srText}
      </span>
    </div>
  );
}
