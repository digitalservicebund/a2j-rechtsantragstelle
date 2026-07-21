import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";

export const getVerstorbeneName = (
  context: NachlassErbscheinAnfrageUserData,
) => {
  return {
    verstorbeneName: `${context.verstorbeneVorname} ${context.verstorbeneNachname}`,
  };
};

export const getVerstorbeneStreetnameHousenumber = (
  context: NachlassErbscheinAnfrageUserData,
) => ({
  verstorbeneStreetnameHousenumber: `${context.verstorbenePersonStrasse} ${context.verstorbenePersonHausnummer}`,
});

export const getVerstorbenePostcodeCity = (
  context: NachlassErbscheinAnfrageUserData,
) => ({
  verstorbenePostcodeCity: `${context.verstorbenePlz} ${context.verstorbenePersonOrt}`,
});

export const getEhepartnerName = (
  context: NachlassErbscheinAnfrageUserData,
) => {
  return {
    ehepartnerName: `${context.ehepartnerVorname} ${context.ehepartnerNachname}`,
  };
};

export const getBeguenstigteStrings = (
  context: NachlassErbscheinAnfrageUserData & {
    beguenstigten?: Array<{
      vorname: string;
      nachname: string;
    }>;
  },
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.beguenstigten ||
    arrayIndex > context.beguenstigten.length + 1
  )
    return {};
  if (arrayIndex < context.beguenstigten.length)
    return {
      "beguenstigten#vorname": context.beguenstigten?.[arrayIndex].vorname,
      "beguenstigten#nachname": context.beguenstigten?.[arrayIndex].nachname,
    };
};
