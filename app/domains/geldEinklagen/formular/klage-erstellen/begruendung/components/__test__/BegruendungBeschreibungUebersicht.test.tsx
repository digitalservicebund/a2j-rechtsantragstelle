import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type FlowId } from "~/domains/flowIds";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../../userData";
import BegruendungBeschreibungUebersicht from "../BegruendungBeschreibungUebersicht";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";

vi.mock("~/components/hooks/formFlowContext", () => ({
  useFormFlow: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useRouteLoaderData: () => ({
      csrfToken: "test-token",
    }),
    useRevalidator: vi.fn(),
  };
});

const mockUseFormFlow = (
  userData: GeldEinklagenFormularKlageErstellenUserData,
  flowId: FlowId,
): void => {
  vi.mocked(useFormFlow).mockReturnValue({
    userData,
    flowId,
    translations: {},
    validFlowPages: {},
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUseFormFlow(
    {
      abschnitte: [
        {
          beschreibung: "Test Beschreibung",
        },
      ],
    },
    "/geld-einklagen/formular",
  );
});

function renderBegruendungBeschreibungUebersicht() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <BegruendungBeschreibungUebersicht />,

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

describe("BegruendungBeschreibungUebersicht", () => {
  it("should not render when flowId is not '/geld-einklagen/formular'", () => {
    mockUseFormFlow(
      {
        abschnitte: [
          {
            beschreibung: "Test Beschreibung",
          },
        ],
      },
      "/beratungshilfe/antrag",
    );

    const { container } = renderBegruendungBeschreibungUebersicht();
    expect(container).toBeEmptyDOMElement();
  });

  it("should not render when abschnitte is empty", () => {
    mockUseFormFlow(
      {
        abschnitte: [],
      },
      "/geld-einklagen/formular",
    );

    const { queryAllByTestId } = renderBegruendungBeschreibungUebersicht();
    expect(
      queryAllByTestId("begruendung-beschreibung-abschnitte"),
    ).toHaveLength(0);
  });

  it("should render the correct number of BegruendungBeschreibungAbschnitte components", () => {
    const { getAllByTestId } = renderBegruendungBeschreibungUebersicht();
    const abschnitteComponents = getAllByTestId(
      "begruendung-beschreibung-abschnitte",
    );
    expect(abschnitteComponents).toHaveLength(1);
  });

  it("should render the add button with correct URL", () => {
    const { getByTestId } = renderBegruendungBeschreibungUebersicht();
    const addButton = getByTestId("add-abschnitt");
    expect(addButton).toHaveAttribute(
      "href",
      "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/1/daten",
    );
  });

  it("should disable the add button and show an InlineNotice component when abschnitte length is 50 or more", () => {
    mockUseFormFlow(
      {
        abschnitte: Array.from({ length: 50 }, (_, i) => ({
          beschreibung: `Test Beschreibung ${i + 1}`,
        })),
      },
      "/geld-einklagen/formular",
    );

    const { getByTestId, getByRole, getByText } =
      renderBegruendungBeschreibungUebersicht();
    const addButton = getByTestId("add-abschnitt");
    expect(addButton).toHaveClass("kern-btn--disabled pointer-events-none");
    expect(getByRole("note")).toBeInTheDocument();
    expect(
      getByText("Maximale Anzahl an Abschnitten erreicht"),
    ).toBeInTheDocument();
  });
});
