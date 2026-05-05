import { render } from "@testing-library/react";
import Kopfzeile from "../Kopfzeile";

describe("Kopfzeile", () => {
  it("should render the Kopfzeile", () => {
    const { container, getByText } = render(<Kopfzeile />);
    const textElement = getByText(
      "Offizielle Website – Bundesrepublik Deutschland",
    );
    const flagWrapper = container.querySelector(".kern-kopfzeile__flagge");
    expect(textElement).toBeVisible();
    expect(flagWrapper).toBeVisible();
    expect(flagWrapper).toHaveAttribute("aria-hidden");
  });
});
