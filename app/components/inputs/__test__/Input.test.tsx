import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import Input from "~/components/inputs/Input";

const COMPONENT_NAME = "test-input";
const COMPONENT_DATA_LIST_INPUT_TEXT = "Mock Data List Input";

jest.mock("remix-validated-form", () => ({
  useField: jest.fn(),
}));

// eslint-disable-next-line react/display-name
jest.mock("~/components/inputs/DataListInput", () => () => (
  <div>{COMPONENT_DATA_LIST_INPUT_TEXT}</div>
));

describe("Input", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // This clears all mocks after each test
  });

  it("in case does not have the props dataList, it should not render DataListInput component", () => {
    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: "Test Placeholder",
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
          <Input name={COMPONENT_NAME} label="Test Label" formId="formId" />
        ),
      },
    ]);

    const { queryByText } = render(<RemixStub />);

    expect(queryByText(COMPONENT_DATA_LIST_INPUT_TEXT)).not.toBeInTheDocument();
  });

  it("in case has the props dataList, it should render DataListInput component", () => {
    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: "Test Placeholder",
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
          <Input
            name={COMPONENT_NAME}
            label="Test Label"
            formId="formId"
            dataList="airports"
          />
        ),
      },
    ]);

    const { queryByText } = render(<RemixStub />);

    expect(queryByText(COMPONENT_DATA_LIST_INPUT_TEXT)).toBeInTheDocument();
  });
});
