import { render } from "@testing-library/react";
import Kopfzeile from "~/components/layout/Kopfzeile";

describe("Kopfzeile", () => {
  it("should render the Kopfzeile", () => {
    const { getByText, getByTestId } = render(<Kopfzeile />);
    const textElement = getByText(
      "Offizielle Website - Bundesrepublik Deutschland",
    );
    const icon = getByTestId("kopfzeileIcon");
    expect(textElement).toBeVisible();
    expect(icon).toBeVisible();
  });
});
