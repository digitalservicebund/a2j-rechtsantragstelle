import { render } from "@testing-library/react";
import InfoBoxItem from "~/components/InfoBoxItem";

const separatorStyleClass =
  ".pt-32.border-0.border-solid.border-0.border-t-2.border-gray-400.first\\:border-none";

describe("InfoBoxItem", () => {
  it("has expected class properties when the separator is enabled", () => {
    const { container } = render(<InfoBoxItem separator={true} />);
    expect(container.querySelector(separatorStyleClass)).toBeInTheDocument();
  });
  it("has expected class properties when the separator is disabled", () => {
    const { container } = render(<InfoBoxItem separator={false} />);
    expect(
      container.querySelector(separatorStyleClass),
    ).not.toBeInTheDocument();
  });
});
