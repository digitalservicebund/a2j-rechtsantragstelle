import { render, waitFor } from "@testing-library/react";
import { useFocusHeadingTag } from "../useFocusHeadingTag";

const TEXT_HEADING_LABEL = "Test Heading";

function DummyComponentWithH1() {
  useFocusHeadingTag();
  return <h1>{TEXT_HEADING_LABEL}</h1>;
}

function DummyComponentWithoutH1() {
  useFocusHeadingTag();
  return <h2>{TEXT_HEADING_LABEL}</h2>;
}

describe("useFocusHeadingTag", () => {
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
      expect(element.getAttribute("tabindex")).not.toBe("-1");
      expect(element).not.toHaveFocus();
    });
  });
});
