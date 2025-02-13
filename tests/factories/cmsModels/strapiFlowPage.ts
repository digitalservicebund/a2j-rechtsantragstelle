import { faker } from "@faker-js/faker";
import { StrapiFormComponentInput } from "~/services/cms/models/StrapiFormComponent";
import { StrapiFormFlowPageInput } from "~/services/cms/models/StrapiFormFlowPage";

export function getStrapiFlowPage(
  params: Pick<StrapiFormFlowPageInput, "stepId" | "form"> &
    Partial<Pick<StrapiFormFlowPageInput, "locale">>,
): StrapiFormFlowPageInput {
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
  params: Partial<Pick<StrapiFormComponentInput, "name">>,
): StrapiFormComponentInput {
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
