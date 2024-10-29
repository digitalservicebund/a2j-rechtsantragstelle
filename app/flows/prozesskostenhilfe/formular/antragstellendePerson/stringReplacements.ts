import type { ProzesskostenhilfeFormularContext } from "app/flows/prozesskostenhilfe/formular";

export const getAntragstellendePersonStrings = (
  context: ProzesskostenhilfeFormularContext,
) => {
  return {
    unterhaltspflichtigePersonName: `${context.unterhaltspflichtigePerson?.vorname ?? ""} ${context.unterhaltspflichtigePerson?.nachname ?? ""}`,
  };
};
