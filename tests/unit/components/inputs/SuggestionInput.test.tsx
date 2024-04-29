import * as remixValidatedForm from "remix-validated-form";
import { createRemixStub } from "@remix-run/testing";
import SuggestionInput from "~/components/inputs/SuggestionInput";
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
    const mockedOnChange = jest.fn();

    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: PLACEHOLDER_MOCK,
        onChange: mockedOnChange,
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

    const { getByText, getByRole } = render(<RemixStub />);

    fireEvent.change(getByRole("combobox"), { target: { value: "Berlin" } });
    await waitFor(() => getByText("Berlin Brandenburg Flughafen (BER)"));
    fireEvent.click(getByText("Berlin Brandenburg Flughafen (BER)"));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
    expect(mockedOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "BER",
      }),
      expect.objectContaining({
        name: COMPONENT_NAME,
      }),
    );
  });

  it("it should render show an no suggestion message in case enter a not existing input", async () => {
    const mockedOnChange = jest.fn();
    const noSuggestionMessage = "Not possible to find your input";

    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: PLACEHOLDER_MOCK,
        onChange: mockedOnChange,
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
            noSuggestionMessage={noSuggestionMessage}
          />
        ),
      },
    ]);

    const { getByText, getByRole } = render(<RemixStub />);

    fireEvent.change(getByRole("combobox"), {
      target: { value: "DATA DONT EXIST" },
    });
    await waitFor(() => getByText(noSuggestionMessage));
  });
});
