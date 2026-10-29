import { useEffect } from "react";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { type KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import {
  getBaseProzessbevollmaechtigteUrl,
  getProzessbevollmaechtigteArrayName,
} from "~/domains/geldEinklagen/anwaltschaft/shared/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";
import {
  type Berufsausuebungsgesellschaft,
  type BerufsausuebungsgesellschaftProzessbevollmaechtigt,
} from "~/domains/geldEinklagen/anwaltschaft/shared/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";

const getBaseAdditionalPersonUrl = (
  relationship: KlageParteiVerhaeltnis,
  parentArrayItemIndex: number,
  arrayName: string,
) => {
  return `${getBaseProzessbevollmaechtigteUrl(relationship)}/${parentArrayItemIndex}/${arrayName}`;
};

export function useAdditionalPersons(
  berufsausuebungsgesellschaft:
    | Berufsausuebungsgesellschaft
    | BerufsausuebungsgesellschaftProzessbevollmaechtigt,
  relationship: KlageParteiVerhaeltnis,
  parentArrayItemIndex: number,
) {
  const berufsausuebungsgesellschaftIsProzessbevollmaechtigt =
    berufsausuebungsgesellschaft.isProzessbevollmaechtigt === "on";
  const arrayName = berufsausuebungsgesellschaftIsProzessbevollmaechtigt
    ? "signaturangaben"
    : "prozessbevollmaechtigte-personen";
  const deleteArrayItem = useDeleteArrayItem(
    `${getProzessbevollmaechtigteArrayName(relationship)}#${arrayName}`,
  );
  const personsArray = berufsausuebungsgesellschaftIsProzessbevollmaechtigt
    ? berufsausuebungsgesellschaft.signaturangaben
    : berufsausuebungsgesellschaft["prozessbevollmaechtigte-personen"];
  const nextItemIndex = personsArray?.length ?? 0;
  const baseAdditionalPersonUrl = getBaseAdditionalPersonUrl(
    relationship,
    parentArrayItemIndex,
    arrayName,
  );
  const additionalPersonIdPrefix = `${relationship}-prozessbevollmaechtigte-${parentArrayItemIndex}-${arrayName}`;
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

  const deleteAdditionalPerson = (index: number) => async () => {
    await deleteArrayItem(baseAdditionalPersonUrl, index);
    setTimeout(() => {
      const element =
        document.getElementById(`${additionalPersonIdPrefix}-${index}`) ??
        document.getElementById(`${additionalPersonIdPrefix}-${index - 1}`) ??
        document.getElementById(`${additionalPersonIdPrefix}-add`);
      element?.focus();
    }, 100);
  };
  return {
    personsArray,
    baseAdditionalPersonUrl,
    nextItemIndex,
    deleteAdditionalPerson,
    additionalPersonIdPrefix,
    onEditAdditionalPerson,
  };
}
