import { type FieldApi, useField } from "@rvf/react-router";
import { render, screen } from "@testing-library/react";
import SplitDateInput from "~/components/formElements/inputs/date/SplitDateInput";

vi.mock("~/services/translations/translations", () => ({
  translations: {
    splitDateComponent: {
      legend: { de: "Geburtsdatum" },
      hintText: { de: "Beispielsweise: 17.3.2015" },
      tagInputLabel: { de: "Tag" },
      monatInputLabel: { de: "Monat" },
      jahrInputLabel: { de: "Jahr" },
    },
  },
}));

vi.mock("@rvf/react-router");

const topLevelFieldName = "birthdate";
const dayFieldName = "birthdate.day";
const fieldErrors: Record<string, string> = {
  birthdate: "Ungültiges Datum",
  day: "Diese Felder müssen ausgefüllt werden.",
  month: "Ungültiger Monat",
  year: "Geburtsdatum älter als 150 Jahre ist nicht relevant.",
};

describe("SplitDateInput", () => {
  beforeEach(() => {
    vi.mocked(useField).mockImplementation((name) => {
      return {
        error: () => fieldErrors[name.split(".").pop()!],
        touched: () => false,
        getInputProps: (props: Record<string, unknown>) => ({ ...props }),
        getControlProps: () => ({}),
      } as FieldApi<any>;
    });
  });

  it("renders day, month and year input fields with correct labels", () => {
    render(<SplitDateInput name="birthdate" isRequired />);

    const dayInput = screen.getByLabelText("Tag");
    expect(dayInput).toBeInTheDocument();
    const monthInput = screen.getByLabelText("Monat");
    expect(monthInput).toBeInTheDocument();
    const yearInput = screen.getByLabelText("Jahr");
    expect(yearInput).toBeInTheDocument();
  });

  it("renders legend", () => {
    render(<SplitDateInput name="birthdate" label="Geburtsdatum" isRequired />);
    const legend = screen.getByText("Geburtsdatum");
    expect(legend).toBeInTheDocument();
    expect(legend.tagName).toBe("LEGEND");
  });
  it("renders suffix when provided", () => {
    render(
      <SplitDateInput
        name="birthdate"
        label="Geburtsdatum"
        suffix="Optional"
        isRequired
      />,
    );

    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("renders hint text as accessible fieldset description", () => {
    render(<SplitDateInput name="birthdate" label="Geburtsdatum" isRequired />);

    const hintText = screen.getByText("Beispielsweise: 17.3.2015");
    expect(hintText).toBeInTheDocument();
    expect(hintText).toHaveAttribute("id", "birthdate-helper");
    expect(screen.getByText("Geburtsdatum").parentElement).toHaveAttribute(
      "aria-describedby",
      "birthdate-helper",
    );
  });

  it("should render the inputs with aria-required true given isRequired true", () => {
    const { getAllByRole } = render(
      <SplitDateInput name="birthdate" isRequired />,
    );

    expect(getAllByRole("textbox")[0]).toHaveAttribute("aria-required", "true");
    expect(getAllByRole("textbox")[1]).toHaveAttribute("aria-required", "true");
    expect(getAllByRole("textbox")[2]).toHaveAttribute("aria-required", "true");
  });

  it("should render the inputs with aria-required true given isRequired false", () => {
    const { getAllByRole } = render(
      <SplitDateInput name="birthdate" isRequired={false} />,
    );

    expect(getAllByRole("textbox")[0]).toHaveAttribute(
      "aria-required",
      "false",
    );
    expect(getAllByRole("textbox")[1]).toHaveAttribute(
      "aria-required",
      "false",
    );
    expect(getAllByRole("textbox")[2]).toHaveAttribute(
      "aria-required",
      "false",
    );
  });

  describe("Error display and handling", () => {
    it("renders an error message if the top-level field has an error", () => {
      vi.mocked(useField).mockImplementation((name) => {
        return {
          error: () => fieldErrors[name.split(".")[0]],
          touched: () => false,
          getInputProps: (props: Record<string, unknown>) => ({ ...props }),
          getControlProps: () => ({}),
        } as FieldApi<any>;
      });
      render(<SplitDateInput name={topLevelFieldName} isRequired />);

      expect(
        screen.getByText(fieldErrors[topLevelFieldName]),
      ).toBeInTheDocument();
    });

    it("renders an error message if any one field has an error, and all have been touched", () => {
      vi.mocked(useField).mockImplementation((name) => {
        return {
          error: () =>
            name === dayFieldName ? fieldErrors[name.split(".").pop()!] : null,
          touched: () => true,
          getInputProps: (props: Record<string, unknown>) => ({ ...props }),
          getControlProps: () => ({}),
        } as FieldApi<any>;
      });
      render(<SplitDateInput name={topLevelFieldName} isRequired />);

      expect(
        screen.getByText(fieldErrors[dayFieldName.split(".").pop()!]),
      ).toBeInTheDocument();
    });

    it("applies aria attributes when errors exist", () => {
      const { getAllByRole } = render(
        <SplitDateInput name="birthdate" isRequired />,
      );

      const formElements = getAllByRole("textbox");
      formElements.forEach((inputField) => {
        expect(inputField).toHaveAttribute("aria-invalid", "true");
        expect(inputField).toHaveAttribute(
          "aria-describedby",
          "birthdate-error",
        );
      });
    });
  });
});
