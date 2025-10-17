import { render } from "@testing-library/react";
import Kopfzeile from "~/components/layout/Kopfzeile";

describe("Kopfzeile", () => {
  it("should render the Kopfzeile", () => {
    const { getByText, getByLabelText } = render(<Kopfzeile />);
    const textElement = getByText(
      "Offizielle Website - Bundesrepublik Deutschland",
    );
    const icon = getByLabelText("Bundesflagge");
    expect(textElement).toBeVisible();
    expect(icon).toBeVisible();
    expect(icon).toHaveAttribute("aria-hidden");
  });
});
