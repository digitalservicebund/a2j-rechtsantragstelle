import { type FluggastrechteUserData } from "../userData";

export const WEITERE_PERSONEN_START_INDEX = 2;

export function isWeiterePersonen({
  isWeiterePersonen,
}: FluggastrechteUserData) {
  return {
    isWeiterePersonen: isWeiterePersonen === "yes",
  };
}

export function getPersonVorname({ vorname }: FluggastrechteUserData) {
  return { personVorname: vorname };
}

export function getPersonNachname({ nachname }: FluggastrechteUserData) {
  return { personNachname: nachname };
}

export const getArrayWeiterePersonenIndexStrings = (
  context: FluggastrechteUserData,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  return typeof arrayIndex !== "undefined"
    ? {
        "arrayWeiterePersonen#index": String(
          arrayIndex + WEITERE_PERSONEN_START_INDEX,
        ),
      }
    : {};
};

export const getWeiterePersonenNameStrings = (
  context: FluggastrechteUserData,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  if (
    typeof arrayIndex === "undefined" ||
    !context.weiterePersonen ||
    arrayIndex > context.weiterePersonen.length + 1
  )
    return {};
  if (arrayIndex < context.weiterePersonen.length)
    return {
      "weiterePersonen#vorname": context.weiterePersonen?.[arrayIndex].vorname,
      "weiterePersonen#nachname":
        context.weiterePersonen?.[arrayIndex].nachname,
    };
};
