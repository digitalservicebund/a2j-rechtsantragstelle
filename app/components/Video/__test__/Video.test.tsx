import { fireEvent, render } from "@testing-library/react";
import Video from "~/components/Video/Video";

const VIDEO_AKTIVIEREN = "Video Aktivieren";
const DATA_POLICY = "Please agree to our lovely data policy :)";
const VIDEO_URL = "https://www.youtube.com/watch?v=ZZ0o6NFCJeI";

describe("Video Component", () => {
  it("should render the cookie consent banner", () => {
    const { getByRole, getByText } = render(
      <Video
        title={"Test Video"}
        url={VIDEO_URL}
        dataProtection={{ markdown: DATA_POLICY }}
      />,
    );
    const cookieConsentHeader = getByRole("heading", { level: 1 });
    expect(cookieConsentHeader).toBeInTheDocument();
    expect(cookieConsentHeader).toHaveTextContent("Hinweis zum Datenschutz");

    expect(getByText(DATA_POLICY)).toBeInTheDocument();

    const cookieConsentButton = getByRole("button");
    expect(cookieConsentButton).toBeInTheDocument();
    expect(cookieConsentButton).toHaveTextContent(VIDEO_AKTIVIEREN);
  });

  it("should disallow playing of the video until cookies are accepted", () => {
    const { getByRole, queryByTitle } = render(
      <Video
        title={"Test Video"}
        url={VIDEO_URL}
        dataProtection={{ markdown: DATA_POLICY }}
      />,
    );

    expect(getByRole("img")).toHaveClass("opacity-60");
    expect(queryByTitle("Test Video")).not.toBeInTheDocument();
  });

  it("should replace the thumbnail with the video when cookies are consented to", () => {
    const { getByRole, queryByTitle, queryByRole } = render(
      <Video
        title={"Test Video"}
        url={VIDEO_URL}
        dataProtection={{ markdown: DATA_POLICY }}
      />,
    );
    expect(getByRole("img")).toBeInTheDocument();
    expect(queryByTitle("Test Video")).not.toBeInTheDocument();
    fireEvent.click(getByRole("button"));
    expect(queryByTitle("Test Video")).toBeInTheDocument();
    expect(queryByRole("img")).not.toBeInTheDocument();
  });
});
