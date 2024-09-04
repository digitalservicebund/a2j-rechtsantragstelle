import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import { CookieBanner } from "~/components/cookieBanner/CookieBanner";

describe("CookieBanner", () => {
  const standardContent = {
    heading: {
      text: "Heading",
      tagName: "h1" as const,
      look: "default" as const,
    },
    paragraphs: [{ markdown: "paragraph" }],
    acceptButtonLabel: "accept",
    declineButtonLabel: "decline",
    cookieSettingLinkText: "",
    cookieSettingLinkUrl: "",
  };

  it("renders content without link when no link props given", () => {
    const CookieBannerWithRemixStub = createRemixStub([
      {
        path: "/",
        Component: () => <CookieBanner content={standardContent} />,
      },
    ]);
    render(<CookieBannerWithRemixStub />);

    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("paragraph")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "decline" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders with link when link props given", () => {
    const CookieBannerWithRemixStub = createRemixStub([
      {
        path: "/",
        Component: () => (
          <CookieBanner
            content={{
              ...standardContent,
              cookieSettingLinkText: "link text",
              cookieSettingLinkUrl: "/url",
            }}
          />
        ),
      },
    ]);
    render(<CookieBannerWithRemixStub />);

    expect(screen.getByRole("link", { name: "link text" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/url");
  });
});
