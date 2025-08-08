import { FormProvider, useForm } from "@rvf/react";
import { render } from "@testing-library/react";
import { z } from "zod";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { SchemaComponents } from "../SchemaComponents";

describe("SchemaComponents", () => {
  function WrappedSchemaComponents(
    props: Readonly<Parameters<typeof SchemaComponents>[0]>,
  ) {
    const form = useForm({
      schema: z.object(props.pageSchema),
      defaultValues: {},
    });

    return (
      <FormProvider scope={form.scope()}>
        <SchemaComponents {...props} />
      </FormProvider>
    );
  }

  it("should render correct text inputs ", () => {
    const pageSchema = { field1: z.string() };
    const { getByRole } = render(
      <WrappedSchemaComponents pageSchema={pageSchema} />,
    );
    const textInput = getByRole("textbox");
    expect(textInput).toHaveAttribute("name", "field1");
  });

  it("should render textarea ", () => {
    const { getByRole } = render(
      <WrappedSchemaComponents
        pageSchema={{ field1: z.string() }}
        formComponents={[
          {
            __component: "form-elements.textarea",
            id: 10,
            name: "field1",
            errorMessages: [],
          },
        ]}
      />,
    );
    const textArea = getByRole("textbox");
    expect(textArea).toHaveAttribute("name", "field1");
  });

  it("should render correct radio buttons ", () => {
    const pageSchema = { field1: z.enum(["option1", "option2"]) };
    const { getAllByRole } = render(
      <WrappedSchemaComponents pageSchema={pageSchema} />,
    );
    const radio = getAllByRole("radio");
    expect(radio.length).toBe(2);
    expect(radio[0]).toHaveAttribute("name", "field1");
    expect(radio[0]).toHaveAttribute("value", "option1");
    expect(radio[1]).toHaveAttribute("name", "field1");
    expect(radio[1]).toHaveAttribute("value", "option2");
  });

  it("should render ZodObject", () => {
    const pageSchema = {
      field1: z.object({ a: z.string(), b: z.string() }),
    };
    const { getAllByRole } = render(
      <WrappedSchemaComponents pageSchema={pageSchema} />,
    );
    const radio = getAllByRole("textbox");
    expect(radio.length).toBe(2);
    expect(radio[0]).toHaveAttribute("name", "field1.a");
    expect(radio[1]).toHaveAttribute("name", "field1.b");
  });

  it("should render tile group ", () => {
    const fieldName = "field1";
    const pageSchema = { [fieldName]: z.enum(["option1"]) };
    const { getByRole } = render(
      <WrappedSchemaComponents
        pageSchema={pageSchema}
        formComponents={[
          {
            __component: "form-elements.tile-group",
            id: 10,
            name: fieldName,
            options: [
              {
                value: "option1",
                title: "option1 title",
                description: "option1 description",
              },
            ],
            errorMessages: [],
            useTwoColumns: false,
          },
        ]}
      />,
    );
    const radio = getByRole("radio");
    expect(radio).toHaveAttribute("name", "field1");
    expect(radio).toHaveAttribute("value", "option1");
    expect(radio.parentElement).toHaveTextContent("option1 title");
    expect(radio.parentElement).toHaveTextContent("option1 description");
  });

  it("should render checkboxes ", () => {
    const fieldName = "field1";
    const pageSchema = { [fieldName]: checkedRequired };
    const { getByRole } = render(
      <WrappedSchemaComponents
        pageSchema={pageSchema}
        formComponents={[
          {
            __component: "form-elements.checkbox",
            label: "label",
            errorMessage: undefined,
            id: 10,
            name: fieldName,
            required: false,
          },
        ]}
      />,
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toHaveAttribute("name", "field1");
    expect(checkbox).toHaveAttribute("value", "on");
    expect(checkbox).not.toBeRequired();
    expect(checkbox.parentElement).toHaveTextContent("label");
  });

  it("should render multiple nested fields ", () => {
    const { getByRole, getAllByRole } = render(
      <WrappedSchemaComponents
        pageSchema={{
          field1: z
            .string()
            .min(1)
            .transform((val) => val.toUpperCase()),
          field2: z.enum(["option1", "option2"]),
        }}
      />,
    );
    const radio = getAllByRole("radio");
    const textInput = getByRole("textbox");
    expect(textInput).toHaveAttribute("name", "field1");

    expect(radio.length).toBe(2);
    expect(radio[0]).toHaveAttribute("name", "field2");
    expect(radio[0]).toHaveAttribute("value", "option1");
    expect(radio[1]).toHaveAttribute("name", "field2");
    expect(radio[1]).toHaveAttribute("value", "option2");
  });

  it("should attach correct labels to inputs ", () => {
    const { getByRole, getByLabelText } = render(
      <WrappedSchemaComponents
        pageSchema={{ field1: z.string() }}
        formComponents={[
          {
            name: "field1",
            label: "label",
            type: "text",
            id: 10,
            suffix: "suffix",
            errorMessages: [],
            width: "10",
            helperText: "helperText",
            __component: "form-elements.input",
          },
          {
            name: "field2",
            type: "text",
            id: 10,
            errorMessages: [],
            width: "10",
            __component: "form-elements.input",
          },
        ]}
      />,
    );
    const textInput = getByRole("textbox");
    const textByLabel = getByLabelText("label");
    expect(textInput).toHaveAttribute("name", "field1");
    expect(textInput).toBe(textByLabel);
  });
});
