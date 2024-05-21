import * as remixValidatedForm from "remix-validated-form";
import { createRemixStub } from "@remix-run/testing";
import SuggestionInput from "~/components/inputs/suggestionInput/SuggestionInput";
import { fireEvent, render, waitFor } from "@testing-library/react";

jest.mock("remix-validated-form", () => ({
  useField: jest.fn(),
}));

afterEach(() => {
  jest.restoreAllMocks(); // This clears all mocks after each test
});

const COMPONENT_NAME = "test-suggestionInput";
const PLACEHOLDER_MOCK = "Test Placeholder";

describe("SuggestionInput", () => {
  it("it should render the component with the placeholder, label and the input name", () => {
    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: PLACEHOLDER_MOCK,
      }),
      clearError: jest.fn(),
      validate: jest.fn(),
      touched: false,
      setTouched: jest.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <SuggestionInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
          />
        ),
      },
    ]);

    const { getByText, container } = render(<RemixStub />);

    expect(getByText("placeholder")).toBeInTheDocument();
    expect(getByText("label")).toBeInTheDocument();
    expect(
      container.querySelector(`input[name='${COMPONENT_NAME}']`),
    ).toBeInTheDocument();
  });

  it("it should render select the first (BER) input after enter Berlin", async () => {
    const mockedValidate = jest.fn();

    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: PLACEHOLDER_MOCK,
      }),
      clearError: jest.fn(),
      validate: mockedValidate,
      touched: false,
      setTouched: jest.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <SuggestionInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
          />
        ),
      },
    ]);

    const { getByText, getByRole, container } = render(<RemixStub />);

    fireEvent.change(getByRole("combobox"), { target: { value: "Berlin" } });
    await waitFor(() => getByText("Berlin Brandenburg Flughafen (BER)"));
    fireEvent.click(getByText("Berlin Brandenburg Flughafen (BER)"));
    expect(mockedValidate).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(
        container.querySelector<HTMLInputElement>(
          `input[name='${COMPONENT_NAME}']`,
        )?.value,
      ).toBe("BER");
    });
  });

  it("it should render show an no suggestion message in case enter a not existing input", async () => {
    const mockedValidate = jest.fn();
    const noSuggestionMessage = "Not possible to find your input";

    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: PLACEHOLDER_MOCK,
      }),
      clearError: jest.fn(),
      validate: mockedValidate,
      touched: false,
      setTouched: jest.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <SuggestionInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
            noSuggestionMessage={noSuggestionMessage}
          />
        ),
      },
    ]);

    const { getByText, getByRole } = render(<RemixStub />);

    fireEvent.change(getByRole("combobox"), {
      target: { value: "DATA DONT EXIST" },
    });
    await waitFor(() => {
      expect(getByText(noSuggestionMessage)).toBeInTheDocument();
    });
  });

  it("it should remove the value in case click on clear button", async () => {
    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: PLACEHOLDER_MOCK,
      }),
      clearError: jest.fn(),
      validate: jest.fn(),
      touched: false,
      setTouched: jest.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <SuggestionInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
          />
        ),
      },
    ]);

    const { getByText, getByRole, container, getByTestId } = render(
      <RemixStub />,
    );

    fireEvent.change(getByRole("combobox"), { target: { value: "Berlin" } });
    await waitFor(() => getByText("Berlin Brandenburg Flughafen (BER)"));
    fireEvent.click(getByText("Berlin Brandenburg Flughafen (BER)"));

    await waitFor(() => {
      expect(
        container.querySelector<HTMLInputElement>(
          `input[name='${COMPONENT_NAME}']`,
        )?.value,
      ).toBe("BER");
    });

    fireEvent.click(getByTestId("clear-input-button"));

    await waitFor(() => {
      expect(
        container.querySelector<HTMLInputElement>(
          `input[name='${COMPONENT_NAME}']`,
        )?.value,
      ).toBe("");
    });
  });
});
