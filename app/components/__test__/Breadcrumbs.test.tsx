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

  it("should have the correct aria label", () => {
    const { container } = render(
      <Breadcrumbs
        breadcrumbs={breadcrumbs}
        linkLabel="Zurück zur Startseite"
      />,
    );
    const nav = container.querySelector("a");
    expect(nav).toHaveAttribute("aria-label", "Zurück zur Startseite");
  });

  it("aria label should be null if not provided", () => {
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    const navLink = container.querySelector("a");
    expect(navLink).not.toHaveAttribute("aria-label", null);
  });
});
