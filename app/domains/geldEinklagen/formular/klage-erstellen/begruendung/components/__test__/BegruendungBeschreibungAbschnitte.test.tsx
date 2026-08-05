import BegruendungBeschreibungAbschnitte from "../BegruendungBeschreibungAbschnitte";
import { render } from "@testing-library/react";
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

describe("BegruendungBeschreibungAbschnitte", () => {
  it("should render the correct heading and description texts", () => {
    const itemIndex = 0;

    const { getByRole, getByText } = render(
      <BegruendungBeschreibungAbschnitte
        abschnitte={{ beschreibung: "Test Beschreibung" }}
        itemIndex={itemIndex}
      />,
    );

    expect(getByRole("heading")).toHaveTextContent("Abschnitt 1");
    expect(getByText("Test Beschreibung")).toBeInTheDocument();
  });

  it("should render the edit and delete buttons", () => {
    const itemIndex = 0;

    const { getByText } = render(
      <BegruendungBeschreibungAbschnitte
        abschnitte={{ beschreibung: "Test Beschreibung" }}
        itemIndex={itemIndex}
      />,
    );

    const editButton = getByText("Beschreibung bearbeiten");
    expect(editButton).toHaveAttribute(
      "href",
      `/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/daten`,
    );

    expect(getByText("Abschnitt löschen")).toBeInTheDocument();
  });

  it("should call the function onAbschnittDelete when the delete button is clicked", () => {
    const itemIndex = 0;
    const onAbschnittDeleteMock = vi.fn();
    vi.mocked(useBegruendungBeschreibung).mockImplementation(() => ({
      onAbschnittDelete: onAbschnittDeleteMock,
      onAbschnittDocumentDelete: vi.fn(),
      onAbschnittPersonDelete: vi.fn(),
    }));

    const { getByText } = render(
      <BegruendungBeschreibungAbschnitte
        abschnitte={{ beschreibung: "Test Beschreibung" }}
        itemIndex={itemIndex}
      />,
    );

    const deleteButton = getByText("Abschnitt löschen");
    deleteButton.click();

    expect(onAbschnittDeleteMock).toHaveBeenCalledWith(
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte",
      itemIndex,
    );
  });
});
