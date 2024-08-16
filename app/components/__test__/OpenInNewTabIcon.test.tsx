import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OpenInNewTabIcon } from "../OpenInNewTabIcon"; // adjust the path as necessary

describe("OpenInNewTabIcon", () => {
  it("renders the OpenInNewIcon with correct aria-labelledby attribute", () => {
    const ariaLabelledBy = "test-aria-labelledby";

    render(<OpenInNewTabIcon ariaLabelledBy={ariaLabelledBy} />);

    const OpenInNewIconElement = screen.getByTestId("OpenInNewIcon");

    expect(OpenInNewIconElement).toHaveAttribute(
      "aria-labelledby",
      ariaLabelledBy,
    );
  });
});
