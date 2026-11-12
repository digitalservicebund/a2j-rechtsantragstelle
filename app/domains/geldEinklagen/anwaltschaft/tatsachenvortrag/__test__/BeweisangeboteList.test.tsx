import { fireEvent, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { BeweisangeboteList } from "../components/BeweisangeboteList";
import { translations } from "~/services/translations/translations";

describe("BeweisangeboteList", () => {
  it("uses shared numbers in rows and deletion descriptions while retaining source links", () => {
    const Stub = createRoutesStub([
      {
        id: "root",
        path: "/",
        Component: () => (
          <BeweisangeboteList
            beweise={[
              {
                beweis: { type: "urkunde", beschreibung: "First document" },
                sourceIndex: 1,
                documentNumber: 4,
              },
              {
                beweis: {
                  type: "augenschein",
                  beschreibung: "Second document",
                },
                sourceIndex: 2,
                documentNumber: 5,
              },
              {
                beweis: {
                  type: "zeuge",
                  anrede: "none",
                  vorname: "Max",
                  nachname: "Muster",
                  strasse: "Musterstrasse",
                  hausnummer: "1",
                  plz: "10115",
                  ort: "Berlin",
                  land: "Deutschland",
                },
                sourceIndex: 0,
                documentNumber: undefined,
              },
            ]}
            absatzArrayIndex={4}
          />
        ),
      },
    ]);

    render(<Stub />);

    expect(screen.getAllByText("Beweis K4")).toHaveLength(2);
    expect(screen.getAllByText("Beweis K5")).toHaveLength(2);
    expect(
      screen
        .getAllByRole("link", { name: "Beweis Bearbeiten" })
        .map((link) => link.getAttribute("href")),
    ).toEqual([
      "/4/beweise/1/urkunde-daten",
      "/4/beweise/2/augenschein-daten",
      "/4/beweise/0/zeuge-daten",
    ]);
  });

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
