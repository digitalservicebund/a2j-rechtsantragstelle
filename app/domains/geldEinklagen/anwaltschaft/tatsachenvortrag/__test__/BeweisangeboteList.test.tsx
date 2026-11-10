import { fireEvent, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { BeweisangeboteList } from "../components/BeweisangeboteList";
import { translations } from "~/services/translations/translations";

describe("BeweisangeboteList", () => {
  it("starts without an evidence type and allows selecting one", () => {
    const Stub = createRoutesStub([
      {
        id: "root",
        path: "/",
        Component: () => (
          <BeweisangeboteList beweise={[]} absatzArrayIndex={0} />
        ),
      },
    ]);

    render(<Stub />);

    const dropdown = screen.getByTestId("select");
    expect(dropdown).toHaveValue("");
    expect(
      screen.getByRole("option", {
        name: translations.geldEinklagenAnwaltschaft.beweismittelPlaceholder.de,
      }),
    ).toHaveProperty("selected", true);

    fireEvent.change(dropdown, { target: { value: "urkunde" } });
    expect(dropdown).toHaveValue("urkunde");
  });
});
