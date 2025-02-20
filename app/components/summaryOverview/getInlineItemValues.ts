import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { arrayIsNonEmpty } from "~/util/array";
import { getItemValueBox } from "./getItemValueBox";

export const getInlineItemValues = (
  userData: Context,
  translations: Translations,
  inlineItems?: Array<{ field: string }>,
) => {
  if (!arrayIsNonEmpty(inlineItems)) {
    return "";
  }

  return inlineItems
    .map(({ field }) => getItemValueBox(translations, userData, field))
    .filter(Boolean)
    .join(" ");
};
