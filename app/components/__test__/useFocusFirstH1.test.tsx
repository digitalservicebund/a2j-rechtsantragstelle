import { render, waitFor } from "@testing-library/react";
import { useFocusFirstH1 } from "../useFocusFirstH1";

const TEXT_HEADING_LABEL = "Test Heading";

function DummyComponentWithH1() {
  useFocusFirstH1();
  return <h1>{TEXT_HEADING_LABEL}</h1>;
}

function DummyComponentWithoutH1() {
  useFocusFirstH1();
  return <h2>{TEXT_HEADING_LABEL}</h2>;
}

describe("useFocusFirstH1", () => {
  it("should set tabindex and focus in case h1 element is present", async () => {
    const { getByText } = render(<DummyComponentWithH1 />);

    const element = getByText(TEXT_HEADING_LABEL);

    await waitFor(() => {
      expect(element.getAttribute("tabindex")).toBe("-1");
      expect(element).toHaveFocus();
    });
  });

  it("should not set tabindex and focus in case h1 element is not present", async () => {
    const { getByText } = render(<DummyComponentWithoutH1 />);

    const element = getByText(TEXT_HEADING_LABEL);

    await waitFor(() => {
      expect(element).not.toHaveAttribute("tabindex");
      expect(element).not.toHaveFocus();
    });
  });
});
