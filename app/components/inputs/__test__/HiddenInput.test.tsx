import { render } from "@testing-library/react";
import HiddenInput from "../HiddenInput";

vi.mock("@rvf/remix", () => ({
  useField: () => ({
    getInputProps: vi.fn().mockReturnValue({
      id: "selectId",
    }),
  }),
}));

describe("HiddenInput", () => {
  it("should render an input hidden", () => {
    const { getByRole } = render(
      <HiddenInput name="hiddenInput" formId="formId" />,
    );

    expect(getByRole("textbox", { hidden: true })).toBeInTheDocument();
  });
});
