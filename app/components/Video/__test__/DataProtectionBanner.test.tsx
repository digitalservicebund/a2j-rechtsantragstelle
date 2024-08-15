import { fireEvent, render } from "@testing-library/react";
import { DataProtectionBanner } from "~/components/Video/DataProtectionBanner";

const bodyText = "Super long and complicated Datenschutz";

describe("Datenschutz Component", () => {
  it("should display the Datenschutz banner", () => {
    const { getByText, getByRole } = render(
      <DataProtectionBanner
        onCookiesAccepted={vi.fn()}
        dataProtection={{ markdown: bodyText }}
      />,
    );
    expect(getByText("Hinweis zum Datenschutz")).toBeInTheDocument();
    expect(getByText(bodyText)).toBeInTheDocument();
    expect(getByRole("button")).toHaveTextContent("Video Aktivieren");
  });

  it("should allow the user to accept the Datenschutz", () => {
    const cookiesAccepted = vi.fn();
    const { getByRole } = render(
      <DataProtectionBanner
        onCookiesAccepted={cookiesAccepted}
        dataProtection={{ markdown: bodyText }}
      />,
    );
    fireEvent.click(getByRole("button"));
    expect(cookiesAccepted).toHaveBeenCalled();
  });
});
