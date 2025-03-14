import { faker } from "@faker-js/faker";
import { fireEvent, render } from "@testing-library/react";
import {
  DataProtectionBanner,
  DATA_PROTECTION_TRANSLATION_VALUES,
} from "~/components/video/DataProtectionBanner";

const videoTranslations = Object.fromEntries(
  DATA_PROTECTION_TRANSLATION_VALUES.map((key) => [
    key,
    faker.lorem.sentence(),
  ]),
);
vi.mock("~/services/translations/translationsContext", () => ({
  useTranslations: () => ({
    video: videoTranslations,
  }),
}));

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
