import z from "zod";
import { sortSchemaByFormComponents } from "../sortSchemaByFormComponents";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";

const pageSchema = {
  email: z.string(),
  lastName: z.string(),
  firstName: z.string(),
};

describe("sortSchemaByFormComponents", () => {
  it("should return the original schema if formComponents is undefined", () => {
    const sortedSchema = sortSchemaByFormComponents(pageSchema);

    expect(sortedSchema).toEqual(pageSchema);
  });

  it("should return the original schema if pageSchema contains one item", () => {
    const pageSchemaOneItem = {
      email: z.string(),
    };

    const sortedSchema = sortSchemaByFormComponents(pageSchemaOneItem);

    expect(sortedSchema).toEqual(pageSchemaOneItem);
  });

  it("should return the schema sorted according to the form elements", () => {
    const formComponents = [
      {
        __component: "form-elements.input",
        name: "firstName",
        id: 1,
        errorMessages: [],
        type: "text",
        width: "10",
      },
      {
        __component: "form-elements.input",
        name: "lastName",
        id: 1,
        errorMessages: [],
        type: "text",
        width: "10",
      },
      {
        __component: "form-elements.input",
        name: "email",
        id: 1,
        errorMessages: [],
        type: "text",
        width: "10",
      },
    ] satisfies StrapiFormComponent[];

    const sortedSchema = sortSchemaByFormComponents(pageSchema, formComponents);

    expect(Object.keys(sortedSchema)).toEqual([
      "firstName",
      "lastName",
      "email",
    ]);
  });

  it("should return the schema sorted according to the form elements when fieldset is present", () => {
    const formComponents = [
      {
        __component: "form-elements.fieldset",
        id: 2,
        heading: "Name",
        fieldSetGroup: {
          formComponents: [
            {
              __component: "form-elements.input",
              name: "firstName",
              id: 3,
              errorMessages: [],
              type: "text",
              width: "10",
            },
            {
              __component: "form-elements.input",
              name: "lastName",
              id: 4,
              errorMessages: [],
              type: "text",
              width: "10",
            },
          ],
        },
      },
      {
        __component: "form-elements.input",
        name: "email",
        id: 1,
        errorMessages: [],
        type: "text",
        width: "10",
      },
    ] satisfies StrapiFormComponent[];

    const sortedSchema = sortSchemaByFormComponents(pageSchema, formComponents);

    expect(Object.keys(sortedSchema)).toEqual([
      "firstName",
      "lastName",
      "email",
    ]);
  });

  it("should move the non existing fields in formComponents in the last of item", () => {
    const formComponents = [
      {
        __component: "form-elements.input",
        name: "firstName",
        id: 1,
        errorMessages: [],
        type: "text",
        width: "10",
      },
    ] satisfies StrapiFormComponent[];

    const sortedSchema = sortSchemaByFormComponents(pageSchema, formComponents);

    expect(Object.keys(sortedSchema)).toEqual([
      "firstName",
      "email",
      "lastName",
    ]);
  });
});
