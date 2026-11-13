import { useEffect } from "react";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import {
  getBaseProzessbevollmaechtigteUrl,
  getProzessbevollmaechtigteArrayName,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";
import { type Berufsausuebungsgesellschaft } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";

export function useVerantwortendePersonen(
  berufsausuebungsgesellschaft: Berufsausuebungsgesellschaft,
  parentArrayItemIndex: number,
) {
  const baseAdditionalPersonUrl = `${getBaseProzessbevollmaechtigteUrl("klagende")}/${parentArrayItemIndex}/verantwortende-personen`;
  const additionalPersonIdPrefix = `klagende-prozessbevollmaechtigte-${parentArrayItemIndex}-verantwortende-personen`;

  const focusAdditionalPerson = (index: number) => {
    setTimeout(() => {
      const element =
        document.getElementById(`${additionalPersonIdPrefix}-${index}`) ??
        document.getElementById(`${additionalPersonIdPrefix}-${index - 1}`) ??
        document.getElementById(`${additionalPersonIdPrefix}-add`);
      element?.focus();
    }, 100);
  };

  const deleteAdditionalPerson = useDeleteArrayItem(
    `${getProzessbevollmaechtigteArrayName("klagende")}#verantwortende-personen`,
    baseAdditionalPersonUrl,
    focusAdditionalPerson,
  );
  const nextItemIndex =
    berufsausuebungsgesellschaft["verantwortende-personen"]?.length ?? 0;
  const focusStorageKey = `focus-${additionalPersonIdPrefix}`;

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const itemIndex = sessionStorage.getItem(focusStorageKey);
      if (itemIndex === null) return;

      const element = document.getElementById(
        `${additionalPersonIdPrefix}-${itemIndex}`,
      );
      if (element) {
        element.focus();
        sessionStorage.removeItem(focusStorageKey);
      }
    }, 0);

    return () => clearTimeout(focusTimer);
  }, [additionalPersonIdPrefix, focusStorageKey]);

  const onEditAdditionalPerson = (index: number) => () => {
    sessionStorage.setItem(focusStorageKey, String(index));
  };

  return {
    personsArray: berufsausuebungsgesellschaft["verantwortende-personen"],
    baseAdditionalPersonUrl,
    nextItemIndex,
    deleteAdditionalPerson,
    additionalPersonIdPrefix,
    onEditAdditionalPerson,
  };
}
