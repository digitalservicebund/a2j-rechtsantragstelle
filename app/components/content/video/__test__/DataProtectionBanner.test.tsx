import { fireEvent, render } from "@testing-library/react";
import {
  DataProtectionBanner,
  DATA_PROTECTION_TRANSLATION_VALUES,
  videoTranslations,
} from "~/components/content/video/DataProtectionBanner";

describe("Datenschutz Component", () => {
  it("should fetch content from video context", () => {
    const { getByText } = render(
      <DataProtectionBanner onCookiesAccepted={vi.fn()} />,
    );

    DATA_PROTECTION_TRANSLATION_VALUES.forEach((key) => {
      expect(getByText(videoTranslations[key])).toBeInTheDocument();
    });
  });

  it("should allow the user to accept the Datenschutz", () => {
    const cookiesAccepted = vi.fn();
    const { getByRole } = render(
      <DataProtectionBanner onCookiesAccepted={cookiesAccepted} />,
    );
    fireEvent.click(getByRole("button"));
    expect(cookiesAccepted).toHaveBeenCalled();
  });
});
