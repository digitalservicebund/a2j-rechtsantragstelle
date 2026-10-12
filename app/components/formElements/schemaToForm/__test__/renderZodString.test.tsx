import { FormProvider, useForm } from "@rvf/react";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { z } from "zod";
import { StrapiFormComponentSchema } from "~/services/cms/models/formElements/StrapiFormComponent";
import { renderZodString } from "../renderZodString";

const RVFWrapper = ({ children }: { children: ReactNode }) => {
  const form = useForm({
    schema: z.object({ field: z.string() }),
    defaultValues: { field: "" },
  });
  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <FormProvider scope={form.scope()}>
          <form {...form.getFormProps()}>{children}</form>
        </FormProvider>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

describe("renderZodString", () => {
  it("renders a text input with the field name as its fallback label", () => {
    render(renderZodString("field", false), { wrapper: RVFWrapper });

    const input = screen.getByRole("textbox", { name: "field" });
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "field");
  });

  it("renders a matching text input with its placeholder and read-only state", () => {
    const matchingElement = StrapiFormComponentSchema.parse({
      __component: "form-elements.input",
      id: 1,
      name: "field",
      type: "text",
      label: "Text label",
      width: "characters24",
      placeholder: "Enter text",
      errors: [],
    });

    render(renderZodString("field", true, matchingElement), {
      wrapper: RVFWrapper,
    });

    const input = screen.getByRole("textbox", { name: "Text label" });
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveAttribute("readonly");
  });

  it("renders a number input with decimal input mode", () => {
    const matchingElement = StrapiFormComponentSchema.parse({
      __component: "form-elements.input",
      id: 1,
      name: "field",
      type: "number",
      label: "Amount",
      width: "characters24",
      errors: [],
    });

    render(renderZodString("field", false, matchingElement), {
      wrapper: RVFWrapper,
    });

    const input = screen.getByRole("textbox", { name: "Amount" });
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("name", "field");
    expect(input).toHaveAttribute("inputmode", "decimal");
  });

  it("renders a textarea with its configured maximum length", () => {
    const matchingElement = StrapiFormComponentSchema.parse({
      __component: "form-elements.textarea",
      id: 1,
      name: "field",
      label: "Description",
      maxLength: 100,
      errors: [],
    });

    render(renderZodString("field", false, matchingElement), {
      wrapper: RVFWrapper,
    });

    const textarea = screen.getByRole("textbox", { name: "Description" });
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("name", "field");
    expect(textarea).toHaveAttribute("maxlength", "100");
  });

  it("renders a date input with the date placeholder", () => {
    const matchingElement = StrapiFormComponentSchema.parse({
      __component: "form-elements.date-input",
      id: 1,
      name: "field",
      label: "Date",
      errors: [],
    });

    render(renderZodString("field", false, matchingElement), {
      wrapper: RVFWrapper,
    });

    const input = screen.getByRole("textbox", { name: "Date" });
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("name", "field");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("placeholder", "TT.MM.JJJJ");
  });

  it("renders a time input with numeric input mode and its placeholder", () => {
    const matchingElement = StrapiFormComponentSchema.parse({
      __component: "form-elements.time-input",
      id: 1,
      name: "field",
      label: "Time",
      placeholder: "HH:MM",
      errors: [],
    });

    render(renderZodString("field", false, matchingElement), {
      wrapper: RVFWrapper,
    });

    const input = screen.getByRole("textbox", { name: "Time" });
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("name", "field");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("placeholder", "HH:MM");
  });

  it("overwrites the fallback field-name label with the matching component label", () => {
    const matchingElement = StrapiFormComponentSchema.parse({
      __component: "form-elements.input",
      id: 1,
      name: "field",
      type: "text",
      label: "CMS label",
      width: "characters24",
      errors: [],
    });

    render(renderZodString("field", false, matchingElement), {
      wrapper: RVFWrapper,
    });

    expect(screen.getByLabelText("CMS label")).toBe(
      screen.getByRole("textbox"),
    );
    expect(screen.queryByLabelText("field")).not.toBeInTheDocument();
  });

  it("does not fall back to the field name when the matching component has no label", () => {
    const matchingElement = StrapiFormComponentSchema.parse({
      __component: "form-elements.input",
      id: 1,
      name: "field",
      type: "text",
      width: "characters24",
      errors: [],
    });

    render(renderZodString("field", false, matchingElement), {
      wrapper: RVFWrapper,
    });

    expect(screen.getByRole("textbox")).toHaveAccessibleName("");
    expect(screen.queryByLabelText("field")).not.toBeInTheDocument();
  });
});
