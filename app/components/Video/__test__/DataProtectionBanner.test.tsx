import { fireEvent, render } from "@testing-library/react";
import type React from "react";
import {
  ACTIVATE_VIDEO_TRANSLATION_KEY,
  HEADER_TRANSLATION_KEY,
  DATA_PROTECTION_TRANSLATION_KEY,
  DataProtectionBanner,
} from "~/components/Video/DataProtectionBanner";
import { VideoTranslationContext } from "~/components/Video/VideoTranslationContext";

const TRANSLATION_KEY_RECORD = {
  [HEADER_TRANSLATION_KEY]: "Hinweis zum Datenschutz",
  [DATA_PROTECTION_TRANSLATION_KEY]: "Super long and complicated Datenschutz",
  [ACTIVATE_VIDEO_TRANSLATION_KEY]: "Video Aktivieren",
};

describe("Datenschutz Component", () => {
  it("should display the Datenschutz banner", () => {
    const { getByText, getByRole } = renderWithTranslations(
      <DataProtectionBanner onCookiesAccepted={vi.fn()} />,
    );
    expect(
      getByText(TRANSLATION_KEY_RECORD[HEADER_TRANSLATION_KEY]),
    ).toBeInTheDocument();
    expect(
      getByText(TRANSLATION_KEY_RECORD[DATA_PROTECTION_TRANSLATION_KEY]),
    ).toBeInTheDocument();
    expect(getByRole("button")).toHaveTextContent(
      TRANSLATION_KEY_RECORD[ACTIVATE_VIDEO_TRANSLATION_KEY],
    );
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

const renderWithTranslations = (component: React.ReactNode) => {
  return render(
    <VideoTranslationContext.Provider
      value={{ translations: TRANSLATION_KEY_RECORD }}
    >
      {component}
    </VideoTranslationContext.Provider>,
  );
};
