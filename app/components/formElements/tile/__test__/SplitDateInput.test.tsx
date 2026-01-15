import { render, screen } from "@testing-library/react";
import SplitDateInput from "../../SplitDateInput";

vi.mock("~/services/translations/translations", () => ({
  translations: {
    splitDateComponent: {
      legend: { de: "Geburtsdatum" },
      hintText: { de: "Beispielsweise: 17 3 2015" },
      tagInputLabel: { de: "Tag" },
      monatInputLabel: { de: "Monat" },
      jahrInputLabel: { de: "Jahr" },
    },
  },
}));

vi.mock("@rvf/react-router", () => ({
  useField: (name: string) => {
    const fieldName = name.split(".").pop();

    const fieldErrors: Record<string, string | null> = {
      day: "Diese Felder müssen ausgefüllt werden.",
      month: null,
      year: "Geburtsdatum älter als 150 Jahre ist nicht relevant.",
    };

    return {
      error: () => fieldErrors[fieldName as string],
      getInputProps: ({ id }: { id: string }) => ({
        id,
        value: "",
      }),
    };
  },
}));

describe("SplitDateInput", () => {
  it("renders day, month and yearinput fields with correct labels", () => {
    render(<SplitDateInput name="birthdate" />);

    const dayInput = screen.getByLabelText("Tag");
    expect(dayInput).toBeInTheDocument();
    expect(dayInput).toHaveClass("ph-no-capture");
    const monthInput = screen.getByLabelText("Monat");
    expect(monthInput).toBeInTheDocument();
    expect(monthInput).toHaveClass("ph-no-capture");
    const yearInput = screen.getByLabelText("Jahr");
    expect(yearInput).toBeInTheDocument();
    expect(yearInput).toHaveClass("ph-no-capture");
  });

  it("renders legend", () => {
    render(<SplitDateInput name="birthdate" />);

    expect(screen.getByText("Geburtsdatum")).toBeInTheDocument();
  });

  it("renders hint text", () => {
    render(<SplitDateInput name="birthdate" />);

    expect(screen.getByText("Beispielsweise: 17 3 2015")).toBeInTheDocument();
  });

  it("renders an error message when one of the fields have errors", () => {
    render(<SplitDateInput name="birthdate" />);

    expect(
      screen.getByText("Diese Felder müssen ausgefüllt werden."),
    ).toBeInTheDocument();
  });

  it("applies aria atributes when errors exist", () => {
    render(<SplitDateInput name="birthdate" />);

    const fieldset = screen.getByRole("group");
    expect(fieldset).toHaveAttribute("aria-invalid", "true");
    expect(fieldset).toHaveAttribute("aria-describedby", "birthdate-error");
    expect(fieldset).toHaveAttribute("aria-errormessage", "birthdate-error");
  });
});
