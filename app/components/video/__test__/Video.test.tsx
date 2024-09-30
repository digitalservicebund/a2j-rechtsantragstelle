import { fireEvent, render } from "@testing-library/react";
import Video from "~/components/video/Video";

const VIDEO_URL = "https://www.youtube.com/watch?v=ZZ0o6NFCJeI";

describe("Video Component", () => {
  it("should render the cookie consent banner", () => {
    const { getByRole } = render(
      <Video title={"Test Video"} url={VIDEO_URL} />,
    );
    const cookieConsentHeader = getByRole("heading", { level: 1 });
    expect(cookieConsentHeader).toBeInTheDocument();

    const cookieConsentButton = getByRole("button");
    expect(cookieConsentButton).toBeInTheDocument();
  });

  it("should disallow playing of the video until cookies are accepted", () => {
    const { getByRole, queryByTitle } = render(
      <Video title={"Test Video"} url={VIDEO_URL} />,
    );

    expect(getByRole("img")).toHaveClass("opacity-60");
    expect(queryByTitle("Test Video")).not.toBeInTheDocument();
  });

  it("should replace the thumbnail with the video when cookies are consented to", () => {
    const { getByRole, queryByTitle, queryByRole } = render(
      <Video title={"Test Video"} url={VIDEO_URL} />,
    );
    expect(getByRole("img")).toBeInTheDocument();
    expect(queryByTitle("Test Video")).not.toBeInTheDocument();
    fireEvent.click(getByRole("button"));
    expect(queryByTitle("Test Video")).toBeInTheDocument();
    expect(queryByRole("img")).not.toBeInTheDocument();
  });

  it("should still render the thumbnail, given accepted cookies and a broken link", () => {
    const { getByRole } = render(
      <Video title={"Test Video"} url={"www.google.com"} />,
    );
    expect(getByRole("img")).toBeInTheDocument();
    expect(getByRole("img")).toHaveProperty(
      "src",
      "https://img.youtube.com/vi/undefined/maxresdefault.jpg",
    );
  });
});
