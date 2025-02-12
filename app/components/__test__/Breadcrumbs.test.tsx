import { render } from "@testing-library/react";
import Breadcrumbs from "../Breadcrumbs";

const breadcrumbs = [
  {
    title: "Beratungshilfe",
    url: "/beratungshilfe",
  },
  {
    title: "Vorab-Check",
    url: "/beratungshilfe/vorabcheck/ergebnis/weitere-zahlungen-summe-absch",
  },
];

describe("Breadcrumbs", () => {
  it("should have the correct classNames for the parant html tags", () => {
    const { getByText } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    expect(getByText(breadcrumbs[0].title).parentElement).toHaveClass(
      "ds-body-02-reg",
    );
    expect(getByText(breadcrumbs[1].title).parentElement).toHaveClass(
      "ds-body-02-reg",
    );
  });

  it("should have the correct aria label if data is provided", () => {
    const { container } = render(
      <Breadcrumbs
        translations={{ "header-breadcrumb": "header-breadcrumb" }}
        breadcrumbs={breadcrumbs}
        linkLabel="Zurück zur Startseite"
      />,
    );
    const navElement = container.querySelector("nav");
    const link = container.querySelector("a");

    expect(navElement).toHaveAttribute("aria-label", "header-breadcrumb");
    expect(link).toHaveAttribute("aria-label", "Zurück zur Startseite");
  });

  it("aria label should be null if not provided", () => {
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    const link = container.querySelector("a");
    const nav = container.querySelector("nav");

    expect(link).not.toHaveAttribute("aria-label", null);
    expect(nav).not.toHaveAttribute("aria-label", null);
  });
});
