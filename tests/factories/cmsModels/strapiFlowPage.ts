import { faker } from "@faker-js/faker";
import { type StrapiFormFlowPageInput } from "~/services/cms/models/StrapiFormFlowPage";

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
    pageTitle: "page title",
  };
}
