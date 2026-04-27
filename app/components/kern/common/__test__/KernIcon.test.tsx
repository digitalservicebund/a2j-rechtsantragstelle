import { render } from "@testing-library/react";
import { KernIcon } from "~/components/kern/common/KernIcon";

describe("KernIcon", () => {
  it("should render an arbitrary icon", () => {
    const { getByTitle } = render(
      <KernIcon name="arrow-back" title="testIcon" />,
    );
    const icon = getByTitle("testIcon");
    expect(icon).toBeInTheDocument();
    expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("should set the aria-label", () => {
    const { getByTitle } = render(
      <KernIcon name="arrow-back" ariaLabel="test-label" title="testIcon" />,
    );

    const icon = getByTitle("testIcon");
    expect(icon.parentElement).toBeInTheDocument();
    expect(icon.parentElement).toHaveAttribute("aria-label", "test-label");
  });
});
