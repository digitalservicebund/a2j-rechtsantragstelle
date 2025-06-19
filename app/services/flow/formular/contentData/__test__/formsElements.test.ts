import { type CMSContent } from "../../buildFormularServerTranslations";
import { formsElements } from "../formsElements";

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
};

describe("formsElements", () => {
  it("should overwrite the altLabel for the heading in case the component is select", () => {
    const mockCmsElementWithRadio = {
      ...mockCmsElement,
      formContent: [
        {
          __component: "form-elements.select",
          name: "someSelect",
          label: null,
          altLabel: "old alt label",
          options: [],
        },
      ],
    } satisfies CMSContent;

    const actual = formsElements(mockCmsElementWithRadio);

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
          label: null,
          altLabel: "old alt label",
          options: [],
        },
      ],
    } satisfies CMSContent;

    const actual = formsElements(mockCmsElementWithRadio);

    expect((actual[0] as { altLabel: string }).altLabel).toBe("old alt label");
  });
});
