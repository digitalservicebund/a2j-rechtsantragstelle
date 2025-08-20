import { render, screen } from "@testing-library/react";
import { decode } from "html-entities";
import PageHeader from "~/components/layout/PageHeader";
import { useShouldPrint } from "../../hooks/useShouldPrint";

vi.mock("~/components/hooks/useShouldPrint");

beforeEach(() => {
  vi.mocked(useShouldPrint).mockReturnValue(false);
});

describe("PageHeader", () => {
  it("should render the page header with correct title and header links", () => {
    render(
      <PageHeader
        title={"Justiz-Services"}
        linkLabel={"Zurück zur Startseite"}
        hideLinks={false}
      />,
    );
    const title = screen.getByText("Justiz-Services");
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute(
      "aria-label",
      "Justiz-Services - Zurück zur Startseite",
    );
    expect(screen.getByLabelText("Hauptmenü")).toBeInTheDocument();
    expect(screen.getByText("Leichte Sprache")).toBeInTheDocument();
    expect(screen.getByText(decode("Gebärdensprache"))).toBeInTheDocument();
  });

  it("should be able to hide the header links", () => {
    render(
      <PageHeader title={"Test Page"} linkLabel={"Test Page"} hideLinks />,
    );
    expect(screen.queryByText("Leichte Sprache")).not.toBeInTheDocument();
    expect(screen.queryByText("Gebärdensprache")).not.toBeInTheDocument();
  });

  it("should render print information when shouldPrint is true", () => {
    vi.mocked(useShouldPrint).mockReturnValue(true);
    const { container } = render(
      <PageHeader title={"Test Page"} linkLabel={"Test Page"} hideLinks />,
    );
    expect(container.innerHTML).toContain(
      "Diese Seite wurde heruntergeladen am",
    );
  });

  it("should render not print information when shouldPrint is false", () => {
    const { container } = render(
      <PageHeader title={"Test Page"} linkLabel={"Test Page"} hideLinks />,
    );
    expect(container.innerHTML).not.toContain(
      "Diese Seite wurde heruntergeladen am",
    );
  });
});
