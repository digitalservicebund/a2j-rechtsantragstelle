import { render } from "@testing-library/react";
import { BegruendungBeschreibungBeweisItems } from "../BegruendungBeschreibungBeweisItems";
import { useBegruendungBeschreibung } from "../useBegruendungBeschreibung";

vi.mock("../useBegruendungBeschreibung");

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useBegruendungBeschreibung).mockImplementation(() => ({
    onAbschnittDelete: vi.fn(),
    onAbschnittDocumentDelete: vi.fn(),
    onAbschnittPersonDelete: vi.fn(),
  }));
});

describe("BegruendungBeschreibungBeweisItems", () => {
  it("should render document with edit and delete when dokumenten are provided", () => {
    const dokumenten = [
      {
        beschreibung: "beschreibung",
      },
    ];

    const { getByText, queryByRole, getByRole } = render(
      <BegruendungBeschreibungBeweisItems
        dokumenten={dokumenten}
        personen={[]}
        itemIndexAbschnitte={0}
      />,
    );

    expect(getByText("beschreibung")).toBeInTheDocument();
    expect(queryByRole("link")).toHaveAttribute(
      "href",
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/dokumenten/0/daten",
    );

    expect(getByRole("button")).toHaveAttribute(
      "aria-label",
      "Dieses Dokument löschen: beschreibung und so weiter",
    );
  });

  it("should call the function onAbschnittDocumentDelete when the delete button is clicked", () => {
    const onAbschnittDocumentDeleteMock = vi.fn();
    vi.mocked(useBegruendungBeschreibung).mockImplementation(() => ({
      onAbschnittDelete: vi.fn(),
      onAbschnittDocumentDelete: onAbschnittDocumentDeleteMock,
      onAbschnittPersonDelete: vi.fn(),
    }));

    const dokumenten = [
      {
        beschreibung: "beschreibung",
      },
    ];

    const { getByRole } = render(
      <BegruendungBeschreibungBeweisItems
        dokumenten={dokumenten}
        personen={[]}
        itemIndexAbschnitte={0}
      />,
    );

    const deleteButton = getByRole("button");
    deleteButton.click();

    expect(onAbschnittDocumentDeleteMock).toHaveBeenCalledWith(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/dokumenten",
      0,
      0,
    );
  });

  it("should render person with edit and delete when personen are provided", () => {
    const personen = [
      {
        personAuswahl: "anotherPerson" as const,
        anrede: "herr" as const,
        title: "",
        vorname: "Max",
        nachname: "Mustermann",
        strasse: "Musterstraße",
        hausnummer: "1",
        plz: "12345",
        ort: "Musterstadt",
        land: "Deutschland",
        telefonnummer: "0123456789",
        email: "max.mustermann@example.com",
        personId: "person-id",
      },
    ];

    const { getByText, queryByRole, getByRole } = render(
      <BegruendungBeschreibungBeweisItems
        dokumenten={[]}
        personen={personen}
        itemIndexAbschnitte={0}
      />,
    );

    expect(getByText("Herr Max Mustermann")).toBeInTheDocument();
    expect(
      getByText("Musterstraße 1, 12345 Musterstadt, Deutschland"),
    ).toBeInTheDocument();
    expect(getByText("0123456789")).toBeInTheDocument();
    expect(getByText("max.mustermann@example.com")).toBeInTheDocument();
    expect(queryByRole("link")).toHaveAttribute(
      "href",
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/personen/0/daten",
    );

    expect(getByRole("button")).toHaveAttribute(
      "aria-label",
      "Max Mustermann löschen",
    );
  });

  it("should not render edit button when personAuswahl is not 'anotherPerson'", () => {
    const personen = [
      {
        personAuswahl: "klagende" as const,
        personId: "person-id",
      },
    ];

    const { queryByRole } = render(
      <BegruendungBeschreibungBeweisItems
        dokumenten={[]}
        personen={personen}
        itemIndexAbschnitte={0}
      />,
    );

    expect(queryByRole("link")).not.toBeInTheDocument();
  });

  it("should render correct text for klagende and beklagte personAuswahl", () => {
    const personen = [
      {
        personAuswahl: "klagende" as const,
        personId: "person-id",
      },
      {
        personAuswahl: "beklagte" as const,
        personId: "person-id",
      },
    ];

    const { getByText } = render(
      <BegruendungBeschreibungBeweisItems
        dokumenten={[]}
        personen={personen}
        itemIndexAbschnitte={0}
      />,
    );

    expect(getByText("Klagende Person")).toBeInTheDocument();
    expect(getByText("Beklagte Person")).toBeInTheDocument();
  });

  it("should call the function onAbschnittPersonDelete when the delete button is clicked", () => {
    const onAbschnittPersonDeleteMock = vi.fn();
    vi.mocked(useBegruendungBeschreibung).mockImplementation(() => ({
      onAbschnittDelete: vi.fn(),
      onAbschnittDocumentDelete: vi.fn(),
      onAbschnittPersonDelete: onAbschnittPersonDeleteMock,
    }));

    const personen = [
      {
        personAuswahl: "klagende" as const,
        personId: "person-id",
      },
    ];

    const { getByRole } = render(
      <BegruendungBeschreibungBeweisItems
        dokumenten={[]}
        personen={personen}
        itemIndexAbschnitte={0}
      />,
    );

    const deleteButton = getByRole("button");
    deleteButton.click();

    expect(onAbschnittPersonDeleteMock).toHaveBeenCalledWith(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/personen",
      0,
      0,
    );
  });
});
