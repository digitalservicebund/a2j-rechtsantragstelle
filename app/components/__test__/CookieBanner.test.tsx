import { render, screen } from "@testing-library/react";
import { CookieBanner } from "~/components/CookieBanner";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

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
    cookieSettingLinkText: null,
    cookieSettingLinkUrl: null,
  };

  it("renders content without link when no link props given", () => {
    const router = createMemoryRouter([
      {
        path: "/",
        element: <CookieBanner content={standardContent} />,
      },
    ]);
    render(<RouterProvider router={router} />);

    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("paragraph")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "decline" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders with link when link props given", () => {
    const router = createMemoryRouter([
      {
        path: "/",
        element: (
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
    render(<RouterProvider router={router} />);

    expect(screen.getByRole("link", { name: "link text" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/url");
  });
});
