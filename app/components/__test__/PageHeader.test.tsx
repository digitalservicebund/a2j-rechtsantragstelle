import { render, screen } from "@testing-library/react";
import PageHeader from "~/components/PageHeader";

describe("PageHeader", () => {
  it("should render the page header with correct title and header links", () => {
    render(
      <PageHeader
        title={"Justiz-Services"}
        linkLabel={"Justiz-Services"}
        hideLinks={false}
        translations={{
          gebaerdensprache: "Gebärdensprache",
          leichtesprache: "Leichte Sprache",
        }}
      />,
    );
    const title = screen.getByText("Justiz-Services");
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute("aria-label", "Justiz-Services");
    expect(screen.getByText("Leichte Sprache")).toBeInTheDocument();
    expect(screen.getByText("Gebärdensprache")).toBeInTheDocument();
  });

  it("should be able to hide the header links", () => {
    render(
      <PageHeader
        title={"Test Page"}
        linkLabel={"Test Page"}
        translations={{
          gebaerdensprache: "Gebärdensprache",
          leichtesprache: "Leichte Sprache",
        }}
        hideLinks
      />,
    );
    expect(screen.queryByText("Leichte Sprache")).not.toBeInTheDocument();
    expect(screen.queryByText("Gebärdensprache")).not.toBeInTheDocument();
  });
});
