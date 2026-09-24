import { RouterProvider } from "react-router/dom";
import { BegruendungBeschreibungBeweise } from "../BegruendungBeschreibungBeweise";
import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../../userData";

vi.mock("../useBegruendungBeschreibung", () => ({
  useBegruendungBeschreibung: () => ({
    onAbschnittDelete: vi.fn(),
    onAbschnittDocumentDelete: vi.fn(),
    onAbschnittPersonDelete: vi.fn(),
  }),
}));

function renderBegruendungBeschreibungBeweise(
  abschnitt: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >[number],
) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <BegruendungBeschreibungBeweise
            abschnitt={abschnitt}
            itemIndexAbschnitt={0}
          />
        ),

        action() {
          return true;
        },
      },
    ],
    {
      initialEntries: ["/"],
    },
  );
  return render(<RouterProvider router={router} />);
}

describe("BegruendungBeschreibungBeweise", () => {
  it("should render the title and description texts", () => {
    const { getByRole, getByText } = renderBegruendungBeschreibungBeweise({
      beschreibung: "Test Beschreibung",
    });

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
      { personAuswahl: "beklagte" as const },
      { personAuswahl: "klagende" as const },
    ];

    const { getByTestId } = renderBegruendungBeschreibungBeweise({
      beschreibung: "Test Beschreibung",
      dokumenten,
      personen,
    });

    expect(getByTestId("beweis-items")).toBeInTheDocument();
  });

  it("should render the buttons for adding dokumenten and personen", () => {
    const { getByText } = renderBegruendungBeschreibungBeweise({
      beschreibung: "Test Beschreibung",
    });

    expect(getByText("Dokument beschreiben").closest("a")).toHaveAttribute(
      "href",
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/0/dokumenten/0/daten",
    );

    expect(getByText("Person angeben").closest("button")).toBeInTheDocument();
  });

  it("should disable the add buttons when the maximum number of items is reached", () => {
    const dokumenten = Array.from({ length: 20 }, (_, i) => ({
      beschreibung: `Dokument ${i + 1}`,
    }));
    const personen = Array.from({ length: 10 }, (_) => ({
      personAuswahl: "beklagte" as const,
    }));

    const { getByText } = renderBegruendungBeschreibungBeweise({
      beschreibung: "Test Beschreibung",
      dokumenten,
      personen,
    });

    expect(getByText("Dokument beschreiben").closest("a")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(getByText("Person angeben").closest("button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
