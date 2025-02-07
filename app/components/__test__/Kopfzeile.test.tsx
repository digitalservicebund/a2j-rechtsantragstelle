import { render } from "@testing-library/react";
import Kopfzeile from "~/components/Kopfzeile";

describe("Kopfzeile", () => {
  it("should render the Kopfzeile", () => {
    const { getByText, getByTestId } = render(<Kopfzeile />);
    expect(
      getByText("Eine offizielle Website der Bundesrepublik Deutschland"),
    ).toBeVisible();
    expect(getByTestId("kopfzeile")).toHaveClass(
      "flex items-center text-left text-xs sm:text-base",
    );
    const kopfzeileContainer = getByTestId("kopfzeile").children[0];
    expect(kopfzeileContainer).toHaveClass(
      "gap-8 sm:gap-16 flex items-center !py-0 !mx-0",
    );
  });

  it("should be able to left-align the Kopfzeile", () => {
    const { getByTestId } = render(<Kopfzeile alignToMainContainer={false} />);
    const kopfzeileContainer = getByTestId("kopfzeile").children[0];
    expect(kopfzeileContainer).toHaveClass("px-8 sm:px-[15px]");
  });
});
