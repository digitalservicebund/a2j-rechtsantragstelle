import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { type StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";

export const strapiFlowPageFactory = Factory.define<
  StrapiFormFlowPage,
  { formFieldName: string }
>(({ transientParams }) => ({
  heading: faker.lorem.words(5),
  preHeading: faker.lorem.words(5),
  nextButtonLabel: null,
  backButtonLabel: null,
  form: [
    strapiFormComponentFactory.build(
      transientParams?.formFieldName
        ? { name: transientParams.formFieldName }
        : {},
    ),
  ],
  stepId: faker.lorem.word(),
  flow_ids: { data: [{ attributes: { flowId: "/beratungshilfe/antrag" } }] },
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

export const strapiFormComponentFactory = Factory.define<StrapiFormComponent>(
  () => ({
    type: faker.helpers.arrayElement(["number", "text"]),
    __component: "form-elements.input",
    label: faker.lorem.word(),
    name: faker.lorem.word(),
    width: "characters3",
    errors: {},
    placeholder: null,
    suffix: null,
    helperText: null,
  }),
);
