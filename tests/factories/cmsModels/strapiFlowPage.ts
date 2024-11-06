import { faker } from "@faker-js/faker";
import { merge, mergeWith, isArray } from "lodash";
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { type StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";

export function getStrapiFlowPage(
  params: Partial<StrapiFormFlowPage>,
): StrapiFormFlowPage {
  return mergeWith(
    {},
    {
      heading: faker.lorem.words(5),
      preHeading: faker.lorem.words(5),
      nextButtonLabel: null,
      backButtonLabel: null,
      form: [params.form ?? getStrapiFormComponent({})],
      stepId: faker.lorem.word(),
      flow_ids: {
        data: [{ attributes: { flowId: "/beratungshilfe/antrag" } }],
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
    },
    params,
    // override default with given forms instead of merging
    (obj, src) => {
      if (isArray(obj?.form)) {
        src.form = obj.form;
      }
      return src;
    },
  );
}

export function getStrapiFormComponent(
  params: Partial<StrapiFormComponent>,
): StrapiFormComponent {
  return merge(
    {
      type: faker.helpers.arrayElement(["number", "text"]),
      __component: "form-elements.input",
      label: faker.lorem.word(),
      name: faker.lorem.word(),
      width: "characters3",
      errors: {},
      placeholder: null,
      suffix: null,
      helperText: null,
      description: "",
      details: null,
      options: null,
      data: null,
      isRequiredError: null,
      dataList: null,
    },
    params,
  );
}
