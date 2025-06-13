import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

export const getVereinfachteErklaerungStrings = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    kindName: `${context.child?.vorname ?? ""} ${context.child?.nachname ?? ""}`,
  };
};
