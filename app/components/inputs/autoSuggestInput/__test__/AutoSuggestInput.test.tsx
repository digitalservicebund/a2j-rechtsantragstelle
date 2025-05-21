import { useField } from "@rvf/react-router";
import { fireEvent, render, waitFor } from "@testing-library/react";
import AutoSuggestInput from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import * as useDataListOptions from "~/components/inputs/autoSuggestInput/useDataListOptions";
import { getDataListOptions } from "~/services/dataListOptions/getDataListOptions";

vi.mock("@rvf/react-router", () => ({
  useField: vi.fn(),
}));

const mockedValidate = vi.fn();
const COMPONENT_NAME = "test-autoSuggestInput";
const PLACEHOLDER_MOCK = "Test Placeholder";

beforeEach(() => {
  vi.mocked(useField).mockReturnValue({
    getInputProps: vi.fn().mockReturnValue({
      id: COMPONENT_NAME,
      placeholder: PLACEHOLDER_MOCK,
    }),
    error: vi.fn().mockReturnValue(undefined),
    getControlProps: vi.fn(),
    getHiddenInputProps: vi.fn(),
    refs: {
      controlled: vi.fn(),
      transient: vi.fn(),
    },
    name: vi.fn(),
    onChange: vi.fn(),
    onBlur: vi.fn(),
    value: vi.fn(),
    setValue: vi.fn(),
    defaultValue: vi.fn(),
    touched: vi.fn(),
    setTouched: vi.fn(),
    dirty: vi.fn(),
    setDirty: vi.fn(),
    clearError: vi.fn(),
    reset: vi.fn(),
    validate: mockedValidate,
  });

  vi.spyOn(useDataListOptions, "default").mockReturnValue(
    getDataListOptions("airports"),
  );
});

afterEach(() => {
  vi.restoreAllMocks(); // This clears all mocks after each test
});

describe("AutoSuggestInput", () => {
  it("it should render the component with the placeholder, label and the input name", () => {
    const { getByText, container } = render(
      <AutoSuggestInput
        name={COMPONENT_NAME}
        placeholder="placeholder"
        dataList="airports"
        label="label"
        isDisabled={false}
      />,
    );

    expect(getByText("placeholder")).toBeInTheDocument();
    expect(getByText("label")).toBeInTheDocument();
    expect(
      container.querySelector(`input[name='${COMPONENT_NAME}']`),
    ).toBeInTheDocument();
  });

  it("it should render select the first (BER) input after enter Berlin", async () => {
    const { getByText, getByRole, container } = render(
      <AutoSuggestInput
        name={COMPONENT_NAME}
        placeholder="placeholder"
        dataList="airports"
        label="label"
        isDisabled={false}
      />,
    );

    fireEvent.change(getByRole("combobox"), { target: { value: "Berlin" } });
    await waitFor(() => getByText("Brandenburg Flughafen (BER)"));
    fireEvent.click(getByText("Brandenburg Flughafen (BER)"));
    await waitFor(() => {
      expect(
        container.querySelector<HTMLInputElement>(
          `input[name='${COMPONENT_NAME}']`,
        )?.value,
      ).toBe("BER");
    });
  });

  it("it should render show an no suggestion message in case enter a not existing input", async () => {
    const noSuggestionMessage = "Not possible to find your input";

    const { getByText, getByRole } = render(
      <AutoSuggestInput
        name={COMPONENT_NAME}
        placeholder="placeholder"
        dataList="airports"
        label="label"
        noSuggestionMessage={noSuggestionMessage}
        isDisabled={false}
      />,
    );

    fireEvent.change(getByRole("combobox"), {
      target: { value: "DATA DONT EXIST" },
    });
    await waitFor(() => {
      expect(getByText(noSuggestionMessage)).toBeInTheDocument();
    });
  });

  it("it should remove the value in case click on clear button", async () => {
    const { getByText, getByRole, container, getByTestId } = render(
      <AutoSuggestInput
        name={COMPONENT_NAME}
        placeholder="placeholder"
        dataList="airports"
        label="label"
        isDisabled={false}
      />,
    );

    fireEvent.change(getByRole("combobox"), { target: { value: "Berlin" } });
    await waitFor(() => getByText("Brandenburg Flughafen (BER)"));
    fireEvent.click(getByText("Brandenburg Flughafen (BER)"));

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

  it("it should have the className `option-was-selected` after selected one option and not have when move out of the field", async () => {
    const { container, getByRole, getByText } = render(
      <AutoSuggestInput
        name={`${COMPONENT_NAME}-option-was-selected`} // change this props avoid the react-select calls the onBlur method when click on the airport option
        placeholder="placeholder"
        dataList="airports"
        label="label"
        isDisabled={false}
      />,
    );

    expect(
      container.querySelector(`.option-was-selected`),
    ).not.toBeInTheDocument();

    fireEvent.change(getByRole("combobox"), { target: { value: "Berlin" } });
    await waitFor(() => getByText("Brandenburg Flughafen (BER)"));
    fireEvent.click(getByText("Brandenburg Flughafen (BER)"));

    await waitFor(() =>
      expect(
        container.querySelector(`.option-was-selected`),
      ).toBeInTheDocument(),
    );

    fireEvent.keyDown(getByRole("combobox"), { key: "Tab", shiftKey: false });

    await waitFor(() =>
      expect(
        container.querySelector(`.option-was-selected`),
      ).not.toBeInTheDocument(),
    );
  });

  it("should have the testid input-COMPONENT_NAME-loaded", () => {
    const { getByTestId } = render(
      <AutoSuggestInput
        name={COMPONENT_NAME}
        placeholder="placeholder"
        dataList="airports"
        label="label"
        isDisabled={false}
      />,
    );

    expect(getByTestId(`input-${COMPONENT_NAME}-loaded`)).toBeInTheDocument();
  });

  it("should have className auto-suggest-input-disabled if the component is disabled", () => {
    const { container } = render(
      <AutoSuggestInput
        name={COMPONENT_NAME}
        placeholder="placeholder"
        dataList="airports"
        label="label"
        isDisabled
      />,
    );

    expect(
      container.querySelector(`.auto-suggest-input-disabled`),
    ).toBeInTheDocument();
  });

  it("should have the attribute aria-required as true for the input when has an error message for required", async () => {
    const { container } = render(
      <AutoSuggestInput
        name={COMPONENT_NAME}
        placeholder="placeholder"
        dataList="airports"
        label="label"
        isDisabled={false}
        errorMessages={[{ code: "required", text: "error" }]}
      />,
    );

    await waitFor(() =>
      expect(
        container.querySelector(`#input-${COMPONENT_NAME}`),
      ).toHaveAttribute("aria-required", "true"),
    );
  });

  it("should have the attribute aria-required as false for the input when does not have error message for required", async () => {
    const { container } = render(
      <AutoSuggestInput
        name={COMPONENT_NAME}
        placeholder="placeholder"
        dataList="airports"
        label="label"
        isDisabled={false}
      />,
    );

    await waitFor(() =>
      expect(
        container.querySelector(`#input-${COMPONENT_NAME}`),
      ).toHaveAttribute("aria-required", "false"),
    );
  });
});
