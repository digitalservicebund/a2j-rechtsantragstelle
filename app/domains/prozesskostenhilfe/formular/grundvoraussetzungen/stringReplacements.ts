import { type ProzesskostenhilfeFormularUserData } from "../userData";

export const getGrundvoraussetzungenStringReplacements = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    hasAnhaengigesGerichtsverfahren:
      context.anhaengigesGerichtsverfahrenFrage === "yes",
    isNachueberpruefung: context.formularArt === "nachueberpruefung",
  };
};
