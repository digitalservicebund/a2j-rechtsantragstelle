import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import { StrapiFormFlowPageSchema } from "~/services/cms/models/StrapiFormFlowPage";

export const strapiFlowPageFactory = Factory.define<
  Zod.infer<typeof StrapiFormFlowPageSchema>,
  { formNames: string[] }
>(({ transientParams, sequence }) => ({
  heading: faker.lorem.words(5),
  preHeading: faker.lorem.words(5),
  nextButtonLabel: null,
  form: faker.helpers.multiple(
    () => ({
      type: faker.helpers.arrayElement(["number", "text"]),
      __component: "form-elements.input",
      label: faker.lorem.word(),
      name: transientParams.formNames?.[sequence - 1] || faker.lorem.word(),
      id: faker.number.int(100),
    }),
    { count: 1 },
  ),
}));
