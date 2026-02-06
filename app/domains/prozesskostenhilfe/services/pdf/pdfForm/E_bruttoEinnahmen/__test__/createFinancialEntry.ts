import { faker } from "@faker-js/faker";
import { arbeitsausgabenArraySchema } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/pages";

export const createFinancialEntry = () => ({
  beschreibung: faker.word.sample(),
  betrag: faker.finance.amount(),
  zahlungsfrequenz: faker.helpers.arrayElement(
    arbeitsausgabenArraySchema.element.shape.zahlungsfrequenz.options,
  ),
});
