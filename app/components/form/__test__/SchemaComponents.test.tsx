import { FormProvider, useForm } from "@rvf/react";
import { render } from "@testing-library/react";
import { z } from "zod";
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

  it("should render multiple nested fields ", () => {
    const pageSchema = {
      field1: z
        .string()
        .min(1)
        .transform((val) => val.toUpperCase()),
      field2: z.enum(["option1", "option2"]),
    };
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
        formElements={[
          {
            name: "field1",
            label: "label",
            type: "text",
            suffix: "suffix",
            errorMessages: [],
            width: "10",
            helperText: "helperText",
            __component: "form-elements.input",
          },
          {
            name: "field2",
            type: "text",
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
