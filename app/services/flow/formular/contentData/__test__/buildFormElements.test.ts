import { type CMSContent } from "../../buildCmsContentAndTranslations";
import { buildFormElements } from "../buildFormElements";

const mockCmsElement = {
  heading: "new heading",
  content: [
    {
      __component: "basic.paragraph" as const,
      text: "someText",
      html: "someText",
    },
  ],
  preHeading: undefined,
  nextButtonLabel: undefined,
  backButtonLabel: undefined,
  postFormContent: [],
  pageMeta: {
    title: "title",
    description: null,
    ogTitle: null,
    breadcrumb: null,
  },
};

describe("buildFormElements", () => {
  it("should overwrite the altLabel for the heading in case the component is select", () => {
    const mockCmsElementWithRadio = {
      ...mockCmsElement,
      formContent: [
        {
          __component: "form-elements.select",
          name: "someSelect",
          altLabel: "old alt label",
          options: [],
          errorMessages: [],
          id: 10,
        },
      ],
    } satisfies CMSContent;

    const actual = buildFormElements(mockCmsElementWithRadio);

    expect((actual[0] as { altLabel: string }).altLabel).toBe("new heading");
  });

  it("should not overwrite the altLabel for the heading in case the heading is undefined", () => {
    const mockCmsElementWithRadio = {
      ...mockCmsElement,
      heading: undefined,
      formContent: [
        {
          __component: "form-elements.select",
          name: "someSelect",
          altLabel: "old alt label",
          options: [],
          errorMessages: [],
          id: 10,
        },
      ],
    } satisfies CMSContent;

    const actual = buildFormElements(mockCmsElementWithRadio);

    expect((actual[0] as { altLabel: string }).altLabel).toBe("old alt label");
  });

  it("should return the form element without any modification if the component is not select", () => {
    const mockCmsElementCheckbox = {
      ...mockCmsElement,
      heading: undefined,
      formContent: [
        {
          __component: "form-elements.checkbox",
          label: "some label",
          name: "checkbox",
          required: false,
          errorMessage: "",
          id: 10,
        },
      ],
    } satisfies CMSContent;

    const actual = buildFormElements(mockCmsElementCheckbox);

    expect(actual[0]).toBe(mockCmsElementCheckbox.formContent[0]);
  });
});
