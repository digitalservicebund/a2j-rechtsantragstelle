import { useEffect } from "react";
import type z from "zod";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { type KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import {
  getBaseProzessbevollmaechtigteUrl,
  getProzessbevollmaechtigteArrayName,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";
import {
  type signaturangabenArraySchema,
  type Berufsausuebungsgesellschaft,
  type BerufsausuebungsgesellschaftProzessbevollmaechtigt,
  type BeklagteBerufsausuebungsgesellschaftProzessbevollmaechtigt,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";
import { translations } from "~/services/translations/translations";

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
    | BerufsausuebungsgesellschaftProzessbevollmaechtigt
    | BeklagteBerufsausuebungsgesellschaftProzessbevollmaechtigt,
  relationship: KlageParteiVerhaeltnis,
  parentArrayItemIndex: number,
) {
  const berufsausuebungsgesellschaftIsProzessbevollmaechtigt =
    berufsausuebungsgesellschaft.isProzessbevollmaechtigt === "on";
  const arrayName =
    relationship === "klagende" &&
    berufsausuebungsgesellschaftIsProzessbevollmaechtigt
      ? "signaturangaben"
      : "prozessbevollmaechtigte-personen";
  const deleteArrayItem = useDeleteArrayItem(
    `${getProzessbevollmaechtigteArrayName(relationship)}#${arrayName}`,
  );
  const berufsausuebungsgesellschaftProzessbevollmaechtigtePersonen =
    "prozessbevollmaechtigte-personen" in berufsausuebungsgesellschaft
      ? berufsausuebungsgesellschaft["prozessbevollmaechtigte-personen"]
      : undefined;
  const personsArray =
    arrayName === "signaturangaben" &&
    "signaturangaben" in berufsausuebungsgesellschaft
      ? berufsausuebungsgesellschaft.signaturangaben
      : berufsausuebungsgesellschaftProzessbevollmaechtigtePersonen;
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
    personsArray: personsArray as
      | Berufsausuebungsgesellschaft["prozessbevollmaechtigte-personen"]
      | z.infer<typeof signaturangabenArraySchema>,
    baseAdditionalPersonUrl,
    nextItemIndex,
    deleteAdditionalPerson,
    additionalPersonIdPrefix,
    onEditAdditionalPerson,
    additionalPersonTranslations: {
      itemTitle:
        translations.geldEinklagenAnwaltschaft[
          arrayName === "signaturangaben"
            ? "signaturangaben"
            : "prozessbevollmaechtigtePersonen"
        ].de,
      deletionTitle:
        translations.geldEinklagenAnwaltschaft[
          arrayName === "signaturangaben"
            ? "signaturangabenDeletionTitle"
            : "prozessbevollmaechtigtePersonenDeletionTitle"
        ].de,
      addItemLabel:
        translations.geldEinklagenAnwaltschaft[
          arrayName === "signaturangaben"
            ? "signaturangaben"
            : "prozessbevollmaechtigtePerson"
        ].de,
    },
  };
}
