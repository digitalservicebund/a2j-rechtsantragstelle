import { BegruendungBeschreibungBeweise } from "../BegruendungBeschreibungBeweise";
import { render } from "@testing-library/react";

vi.mock("../useBegruendungBeschreibung", () => ({
  useBegruendungBeschreibung: () => ({
    onAbschnittDelete: vi.fn(),
    onAbschnittDocumentDelete: vi.fn(),
    onAbschnittPersonDelete: vi.fn(),
  }),
}));

describe("BegruendungBeschreibungBeweise", () => {
  it("should render the title and description texts", () => {
    const { getByRole, getByText } = render(
      <BegruendungBeschreibungBeweise
        abschnitte={{ beschreibung: "Test Beschreibung" }}
        itemIndexAbschnitte={0}
      />,
    );

    expect(getByRole("heading")).toHaveTextContent("Beweise");
    expect(
      getByText(
        "Dokumente: zum Beispiel Fotos, Videos, Verträge, Rechnungen, sonstige Unterlagen. Personen: Zeugen oder Zeuginnen, in Ausnahmefällen Sie selbst oder die beklagte Person.",
      ),
    ).toBeInTheDocument();
  });

  it("should render beweise items when dokumenten and personen are provided", () => {
    const dokumenten = [
      { beschreibung: "Dokument 1" },
      { beschreibung: "Dokument 2" },
    ];
    const personen = [
      { personAuswahl: "beklagte" as const, personId: "beklagte-person-id" },
      { personAuswahl: "klagende" as const, personId: "klagende-person-id" },
    ];

    const { getByTestId } = render(
      <BegruendungBeschreibungBeweise
        abschnitte={{ beschreibung: "Test Beschreibung", dokumenten, personen }}
        itemIndexAbschnitte={0}
      />,
    );

    expect(getByTestId("beweis-items")).toBeInTheDocument();
  });

  it("should render the buttons for adding dokumenten and personen", () => {
    const { getByText } = render(
      <BegruendungBeschreibungBeweise
        abschnitte={{ beschreibung: "Test Beschreibung" }}
        itemIndexAbschnitte={0}
      />,
    );

    expect(getByText("Dokument beschreiben").closest("a")).toHaveAttribute(
      "href",
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/dokumenten/0/daten",
    );

    expect(getByText("Person angeben").closest("a")).toHaveAttribute(
      "href",
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/personen/0/auswahl",
    );
  });

  it("should disable the add buttons when the maximum number of items is reached", () => {
    const dokumenten = Array.from({ length: 20 }, (_, i) => ({
      beschreibung: `Dokument ${i + 1}`,
    }));
    const personen = Array.from({ length: 10 }, (_, i) => ({
      personAuswahl: "beklagte" as const,
      personId: `beklagte-person-id-${i}`,
    }));

    const { getByText } = render(
      <BegruendungBeschreibungBeweise
        abschnitte={{ beschreibung: "Test Beschreibung", dokumenten, personen }}
        itemIndexAbschnitte={0}
      />,
    );

    expect(getByText("Dokument beschreiben").closest("a")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(getByText("Person angeben").closest("a")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
