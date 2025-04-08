import { fireEvent, render, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import * as remixValidatedForm from "remix-validated-form";
import AutoSuggestInput from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import * as useDataListOptions from "~/components/inputs/autoSuggestInput/useDataListOptions";
import { getDataListOptions } from "~/services/dataListOptions/getDataListOptions";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

const mockedValidate = vi.fn();
const COMPONENT_NAME = "test-autoSuggestInput";
const PLACEHOLDER_MOCK = "Test Placeholder";

beforeEach(() => {
  vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
    error: undefined,
    getInputProps: vi.fn().mockReturnValue({
      id: COMPONENT_NAME,
      placeholder: PLACEHOLDER_MOCK,
    }),
    clearError: vi.fn(),
    validate: mockedValidate,
    touched: false,
    setTouched: vi.fn(),
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
    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <AutoSuggestInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
            isDisabled={false}
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
    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <AutoSuggestInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
            isDisabled={false}
          />
        ),
      },
    ]);

    const { getByText, getByRole, container } = render(<RemixStub />);

    fireEvent.change(getByRole("combobox"), { target: { value: "Berlin" } });
    await waitFor(() => getByText("Brandenburg Flughafen (BER)"));
    fireEvent.click(getByText("Brandenburg Flughafen (BER)"));
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
    const noSuggestionMessage = "Not possible to find your input";

    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <AutoSuggestInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
            noSuggestionMessage={noSuggestionMessage}
            isDisabled={false}
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
    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <AutoSuggestInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
            isDisabled={false}
          />
        ),
      },
    ]);

    const { getByText, getByRole, container, getByTestId } = render(
      <RemixStub />,
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
    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <AutoSuggestInput
            name={`${COMPONENT_NAME}-option-was-selected`} // change this props avoid the react-select calls the onBlur method when click on the airport option
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
            isDisabled={false}
          />
        ),
      },
    ]);

    const { container, getByRole, getByText } = render(<RemixStub />);

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
    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <AutoSuggestInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
            isDisabled={false}
          />
        ),
      },
    ]);

    const { getByTestId } = render(<RemixStub />);

    expect(getByTestId(`input-${COMPONENT_NAME}-loaded`)).toBeInTheDocument();
  });

  it("should have className auto-suggest-input-disabled if the component is disabled", () => {
    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <AutoSuggestInput
            name={COMPONENT_NAME}
            placeholder="placeholder"
            dataList="airports"
            label="label"
            formId="formId"
            isDisabled
          />
        ),
      },
    ]);

    const { container } = render(<RemixStub />);

    expect(
      container.querySelector(`.auto-suggest-input-disabled`),
    ).toBeInTheDocument();
  });
});
