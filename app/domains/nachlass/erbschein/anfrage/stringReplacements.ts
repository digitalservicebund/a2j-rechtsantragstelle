import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

export const getVerstorbeneName = (
  context: NachlassErbscheinAnfrageUserData,
) => {
  return {
    verstorbeneName: `${context.verstorbeneVorname} ${context.verstorbeneNachname}`,
  };
};
