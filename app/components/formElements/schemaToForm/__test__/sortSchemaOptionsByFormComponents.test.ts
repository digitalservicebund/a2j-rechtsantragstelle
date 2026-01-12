import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { sortSchemaOptionsByFormComponents } from "../sortSchemaOptionsByFormComponents";
import z from "zod";

describe("sortSchemaOptionsByFormComponents", () => {
  const enumSchema = z.enum(["option1", "option2", "option3", "option4"]);

  it("should return the original options if formComponent is undefined", () => {
    const sortedOptions = sortSchemaOptionsByFormComponents(enumSchema);

    expect(sortedOptions).toEqual(enumSchema.options);
  });

  it("should return the original options if formComponent is not option-based", () => {
    const formComponent = {
      __component: "form-elements.input",
      id: 1,
      errorMessages: [],
      type: "text",
      width: "10",
      name: "testInput",
    } satisfies StrapiFormComponent;

    const sortedOptions = sortSchemaOptionsByFormComponents(
      enumSchema,
      formComponent,
    );

    expect(sortedOptions).toEqual(enumSchema.options);
  });

  it("should return the options sorted according to the form component options", () => {
    const formComponent = {
      __component: "form-elements.select",
      id: 1,
      errorMessages: [],
      name: "testSelect",
      options: [
        { value: "option4", text: "Option 4" },
        { value: "option3", text: "Option 3" },
        { value: "option2", text: "Option 2" },
        { value: "option1", text: "Option 1" },
      ],
    } satisfies StrapiFormComponent;

    const sortedOptions = sortSchemaOptionsByFormComponents(
      enumSchema,
      formComponent,
    );

    expect(sortedOptions).toEqual(["option4", "option3", "option2", "option1"]);
  });

  it("should move the non existing fields in formComponent in the last of item", () => {
    const formComponent = {
      __component: "form-elements.tile-group",
      id: 1,
      errorMessages: [],
      name: "testSelect",
      useTwoColumns: false,
      options: [
        { value: "option4", title: "Option 4" },
        { value: "option3", title: "Option 3" },
        { value: "option1", title: "Option 1" },
      ],
    } satisfies StrapiFormComponent;

    const sortedOptions = sortSchemaOptionsByFormComponents(
      enumSchema,
      formComponent,
    );

    expect(sortedOptions).toEqual(["option4", "option3", "option1", "option2"]);
  });
});
