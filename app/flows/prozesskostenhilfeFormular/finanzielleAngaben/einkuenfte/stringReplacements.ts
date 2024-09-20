import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";

export const getPartnerArbeitsausgabenStrings = (
  context: ProzesskostenhilfeFormularContext,
) => {
  const arrayIndex = context.partnerEinkuenfte?.pageData?.arrayIndexes.at(0);
  if (
    typeof arrayIndex === "undefined" ||
    !context.partnerEinkuenfte ||
    !context.partnerEinkuenfte.arbeitsausgaben ||
    arrayIndex > context.partnerEinkuenfte.arbeitsausgaben.length + 1
  )
    return {};
  if (arrayIndex < context.partnerEinkuenfte.arbeitsausgaben.length)
    return {
      "partnerEinkuenfte.arbeitsausgaben#beschreibung":
        context.partnerEinkuenfte.arbeitsausgaben?.[arrayIndex].beschreibung,
      "partnerEinkuenfte.arbeitsausgaben#betrag":
        context.partnerEinkuenfte.arbeitsausgaben?.[arrayIndex].betrag,
    };
};
