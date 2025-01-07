import { faker } from "@faker-js/faker";
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { type StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";

export function getStrapiFlowPage(
  params: Partial<Pick<StrapiFormFlowPage, "stepId" | "form" | "locale">>,
): StrapiFormFlowPage {
  return {
    heading: faker.lorem.words(5),
    preHeading: faker.lorem.words(5),
    nextButtonLabel: null,
    backButtonLabel: null,
    form: params.form ?? [],
    stepId: params.stepId ?? faker.lorem.word(),
    flow_ids: [{ flowId: "/beratungshilfe/antrag" }],
    pre_form: [],
    post_form: [],
    locale: params.locale ?? "de",
    meta: {
      title: faker.lorem.word(),
      breadcrumb: faker.lorem.word(),
      description: null,
      ogTitle: null,
    },
  };
}

export function getStrapiFormComponent(
  params: Partial<Pick<StrapiFormComponent, "name">>,
): StrapiFormComponent {
  return {
    type: faker.helpers.arrayElement(["number", "text"]),
    __component: "form-elements.input",
    label: faker.lorem.word(),
    name: params.name ?? faker.lorem.word(),
    width: "characters3",
    errors: [],
    placeholder: null,
    suffix: null,
    helperText: null,
  };
}
