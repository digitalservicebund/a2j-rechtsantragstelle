import { fireEvent, render } from "@testing-library/react";
import {
  ACTIVATE_VIDEO_TRANSLATION_KEY,
  HEADER_TRANSLATION_KEY,
  DATA_PROTECTION_TRANSLATION_KEY,
  DataProtectionBanner,
} from "~/components/video/DataProtectionBanner";
import { TranslationContext } from "~/services/translations/translationsContext";

describe("Datenschutz Component", () => {
  it("should fetch content from video context", () => {
    const videoTranslations = {
      [HEADER_TRANSLATION_KEY]: "Hinweis zum Datenschutz",
      [DATA_PROTECTION_TRANSLATION_KEY]:
        "Super long and complicated Datenschutz",
      [ACTIVATE_VIDEO_TRANSLATION_KEY]: "Video Aktivieren",
    };

    const { getByText, getByRole } = render(
      <TranslationContext.Provider
        value={{ video: videoTranslations, feedback: {}, accessibility: {} }}
      >
        <DataProtectionBanner onCookiesAccepted={vi.fn()} />
      </TranslationContext.Provider>,
    );

    expect(
      getByText(videoTranslations[HEADER_TRANSLATION_KEY]),
    ).toBeInTheDocument();
    expect(
      getByText(videoTranslations[DATA_PROTECTION_TRANSLATION_KEY]),
    ).toBeInTheDocument();
    expect(getByRole("button")).toHaveTextContent(
      videoTranslations[ACTIVATE_VIDEO_TRANSLATION_KEY],
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
