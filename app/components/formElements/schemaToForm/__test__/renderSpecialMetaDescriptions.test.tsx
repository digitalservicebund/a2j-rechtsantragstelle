import { render, screen } from "@testing-library/react";
import z from "zod";
import { renderSpecialMetaDescriptions } from "../renderSchemaBasedFormElement";
import { translations } from "~/services/translations/translations";

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    getInputProps: vi.fn().mockReturnValue({ id: "fieldId" }),
    error: vi.fn().mockReturnValue(null),
  }),
}));

const makeDropdownElement = (overrides: Record<string, unknown> = {}) =>
  ({
    __component: "form-elements.dropdown",
    name: "parentField",
    label: undefined,
    placeholder: undefined,
    options: [],
    errorMessages: undefined,
    width: undefined,
    id: 1,
    ...overrides,
  }) as any;

describe("renderSpecialMetaDescriptions — dynamic_select", () => {
  it("renders a select element with the provided runtime options", () => {
    const options = [
      { value: "0", text: "Maria", preSelected: false },
      { value: "1", text: "Hans", preSelected: false },
    ];
    render(
      renderSpecialMetaDescriptions(
        "parentField",
        "dynamic_select" as any,
        z.string().optional(),
        undefined,
        makeDropdownElement(),
        { parentField: options },
      )!,
    );
    expect(screen.getByTestId("select")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("Hans")).toBeInTheDocument();
  });

  it("renders the label from the Strapi matchingElement", () => {
    render(
      renderSpecialMetaDescriptions(
        "parentField",
        "dynamic_select" as any,
        z.string().optional(),
        undefined,
        makeDropdownElement({ label: "Elternteil wählen" }),
        { parentField: [] },
      )!,
    );
    expect(screen.getByText("Elternteil wählen")).toBeInTheDocument();
  });

  it("falls back to default translation when matchingElement has no placeholder", () => {
    render(
      renderSpecialMetaDescriptions(
        "parentField",
        "dynamic_select" as any,
        z.string().optional(),
        undefined,
        makeDropdownElement(),
        { parentField: [] },
      )!,
    );
    expect(
      screen.getByText(translations.select.placeholder.de),
    ).toBeInTheDocument();
  });

  it("renders select even when matchingElement is undefined", () => {
    const options = [{ value: "0", text: "Maria", preSelected: false }];
    render(
      renderSpecialMetaDescriptions(
        "parentField",
        "dynamic_select" as any,
        z.string().optional(),
        undefined,
        undefined,
        { parentField: options },
      )!,
    );
    expect(screen.getByTestId("select")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("ignores CMS options array and uses only dynamicOptions", () => {
    const cmsOptions = [
      { value: "cms", text: "CMS Option", preSelected: false },
    ];
    const runtimeOptions = [{ value: "0", text: "Maria", preSelected: false }];
    render(
      renderSpecialMetaDescriptions(
        "parentField",
        "dynamic_select" as any,
        z.string().optional(),
        undefined,
        makeDropdownElement({ options: cmsOptions }),
        { parentField: runtimeOptions },
      )!,
    );
    expect(screen.queryByText("CMS Option")).not.toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("renders an empty select (placeholder only) when dynamicOptions is absent", () => {
    render(
      renderSpecialMetaDescriptions(
        "parentField",
        "dynamic_select" as any,
        z.string().optional(),
        undefined,
        makeDropdownElement(),
        undefined,
      )!,
    );
    const select = screen.getByTestId("select");
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll("option").length).toBe(1); // only placeholder
  });
});
