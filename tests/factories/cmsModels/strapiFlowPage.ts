import { faker } from "@faker-js/faker";
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { type StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";

export function getStrapiFlowPage(
  params: Pick<StrapiFormFlowPage, "stepId" | "form"> &
    Partial<Pick<StrapiFormFlowPage, "locale">>,
): StrapiFormFlowPage {
  return {
    heading: faker.lorem.words(5),
    preHeading: faker.lorem.words(5),
    nextButtonLabel: null,
    backButtonLabel: null,
    form: params.form,
    stepId: params.stepId,
    flow_ids: [{ flowId: "/beratungshilfe/antrag" }],
    pre_form: [],
    post_form: [],
    locale: params.locale ?? "de",
    pageMeta: {
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
