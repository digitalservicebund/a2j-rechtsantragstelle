import { render } from "@testing-library/react";
import Breadcrumbs from "../Breadcrumbs";

describe("Breadcrumbs", () => {
  it("should have the correct classNames for html tags", () => {
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

    const { getByText } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    expect(getByText(breadcrumbs[0].title)).toHaveClass("ds-label-03-reg");
    expect(getByText(breadcrumbs[1].title)).toHaveClass("ds-body-02-reg");
  });
});
