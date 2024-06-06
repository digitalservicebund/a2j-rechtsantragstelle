import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import Input from "~/components/inputs/Input";

const COMPONENT_NAME = "test-input";
const COMPONENT_DATA_LIST_INPUT_TEXT = "Mock Data List Input";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

// eslint-disable-next-line react/display-name
vi.mock("~/components/inputs/DataListInput", () => ({
  default: () => <div>{COMPONENT_DATA_LIST_INPUT_TEXT}</div>,
}));

describe("Input", () => {
  afterEach(() => {
    vi.restoreAllMocks(); // This clears all mocks after each test
  });

  it("in case does not have the props dataList, it should not render DataListInput component", () => {
    vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: vi.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: "Test Placeholder",
      }),
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
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
    vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: vi.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: "Test Placeholder",
      }),
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
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
