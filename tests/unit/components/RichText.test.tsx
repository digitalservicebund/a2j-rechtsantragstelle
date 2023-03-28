import { render, screen } from "@testing-library/react";
import RichText from "~/components/RichText";

describe("RichText component", () => {
  it("should render internal link", () => {
    const markdown = "[Link](/link)";
    render(<RichText markdown={markdown} />);
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Link")).toHaveAttribute("href", "/link");
    expect(screen.getByText("Link")).not.toHaveAttribute("target");
  });

  it("should render external link", () => {
    const markdown = "[Link](ext:/link)";
    render(<RichText markdown={markdown} />);
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Link")).toHaveAttribute("href", "/link");
    expect(screen.getByText("Link")).toHaveAttribute("target", "_blank");
  });
});
