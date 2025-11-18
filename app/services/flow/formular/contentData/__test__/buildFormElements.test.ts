import { type CMSContent } from "../../buildCmsContentAndTranslations";
import { buildFormElements } from "../buildFormElements";

const mockCmsElement = {
  heading: "new heading",
  content: [
    {
      __component: "basic.paragraph" as const,
      text: "someText",
      html: "someText",
      required: true,
      id: 10,
    },
  ],
  preHeading: undefined,
  nextButtonLabel: undefined,
  backButtonLabel: undefined,
  postFormContent: [],
  pageTitle: "page title",
};

const mockUserData = {
  name: "name",
  pageData: { arrayIndexes: [] },
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

    const actual = buildFormElements(mockCmsElementWithRadio, mockUserData);

    expect((actual[0] as { altLabel: string }).altLabel).toBe("new heading");
  });

  it("should enrich streetNames auto-suggest-input with plz", () => {
    const mockCmsElementWithAutoComplete = {
      ...mockCmsElement,
      formContent: [
        {
          __component: "form-elements.auto-suggest-input",
          name: "streetname",
          dataList: "streetNames",
          width: "10",
          isDisabled: false,
          supportsFreeText: false,
          errorMessages: [],
          id: 10,
          dataListArgument: undefined,
        },
      ],
    } satisfies CMSContent;

    const actual = buildFormElements(mockCmsElementWithAutoComplete, {
      plz: "12345",
      pageData: { arrayIndexes: [] },
    });

    expect(actual[0]).toMatchObject({ dataListArgument: "12345" });
  });

  it("should enrich streetNames auto-suggest-input with postleitzahlBeklagtePerson", () => {
    const mockCmsElementWithAutoComplete = {
      ...mockCmsElement,
      formContent: [
        {
          __component: "form-elements.auto-suggest-input",
          name: "streetname",
          dataList: "streetNames",
          width: "10",
          isDisabled: false,
          supportsFreeText: false,
          errorMessages: [],
          id: 10,
          dataListArgument: undefined,
        },
      ],
    } satisfies CMSContent;

    const actual = buildFormElements(mockCmsElementWithAutoComplete, {
      postleitzahlBeklagtePerson: "12345",
      pageData: { arrayIndexes: [] },
    });

    expect(actual[0]).toMatchObject({ dataListArgument: "12345" });
  });

  it("should enrich streetNames auto-suggest-input with postleitzahlSecondary", () => {
    const mockCmsElementWithAutoComplete = {
      ...mockCmsElement,
      formContent: [
        {
          __component: "form-elements.auto-suggest-input",
          name: "streetname",
          dataList: "streetNames",
          width: "10",
          isDisabled: false,
          supportsFreeText: false,
          errorMessages: [],
          id: 10,
          dataListArgument: undefined,
        },
      ],
    } satisfies CMSContent;

    const actual = buildFormElements(mockCmsElementWithAutoComplete, {
      postleitzahlSecondary: "12345",
      pageData: { arrayIndexes: [] },
    });

    expect(actual[0]).toMatchObject({ dataListArgument: "12345" });
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

    const actual = buildFormElements(mockCmsElementWithRadio, mockUserData);

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
          errorMessage: "",
          required: true,
          id: 10,
        },
      ],
    } satisfies CMSContent;

    const actual = buildFormElements(mockCmsElementCheckbox, mockUserData);

    expect(actual[0]).toBe(mockCmsElementCheckbox.formContent[0]);
  });
});
