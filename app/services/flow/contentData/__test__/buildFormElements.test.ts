import { type CMSContent } from "../buildCmsContentAndTranslations";
import { buildFormElements } from "../buildFormElements";

const mockCmsElement: CMSContent = {
  heading: "new heading",
  content: [
    {
      __component: "basic.paragraph",
      text: "someText",
      html: "someText",
      id: 10,
    },
  ],
  preHeading: undefined,
  nextButtonLabel: undefined,
  backButtonLabel: undefined,
  postFormContent: [],
  pageTitle: "page title",
  formContent: [],
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

  it("should overwrite the altLabel for the heading of the content if heading is undefined in case the component is select", () => {
    const mockCmsElementWithRadio = {
      ...mockCmsElement,
      heading: undefined,
      content: [
        {
          __component: "basic.heading",
          text: "some heading",
          tagName: "h2",
          id: 11,
        },
      ],
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

    expect((actual[0] as { altLabel: string }).altLabel).toBe("some heading");
  });
});
