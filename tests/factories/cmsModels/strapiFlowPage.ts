import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import { StrapiFormFlowPageSchema } from "~/services/cms/models/StrapiFormFlowPage";

export const strapiFlowPageFactory = Factory.define<
  Zod.infer<typeof StrapiFormFlowPageSchema>,
  { formFieldName: string }
>(({ transientParams }) => ({
  heading: faker.lorem.words(5),
  preHeading: faker.lorem.words(5),
  nextButtonLabel: null,
  form: [
    {
      type: faker.helpers.arrayElement(["number", "text"]),
      __component: "form-elements.input",
      label: faker.lorem.word(),
      name: transientParams.formFieldName ?? faker.lorem.word(),
      id: faker.number.int(100),
      width: "characters3",
      errors: {},
      placeholder: null,
      suffix: null,
    },
  ],
  stepId: null,
  flow_ids: {
    data: [
      {
        attributes: { flowId: "/beratungshilfe/antrag" },
      },
    ],
  },
  pre_form: [],
  post_form: [],
  locale: "de",
  createdAt: faker.date.anytime().toISOString(),
  updatedAt: faker.date.anytime().toISOString(),
  publishedAt: faker.date.anytime().toISOString(),
  meta: {
    title: faker.lorem.word(),
    breadcrumb: faker.lorem.word(),
    description: null,
    ogTitle: null,
  },
}));
