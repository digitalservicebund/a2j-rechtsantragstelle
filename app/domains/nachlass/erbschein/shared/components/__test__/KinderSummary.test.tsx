import { render } from "@testing-library/react";
import { KinderSummary } from "~/domains/nachlass/erbschein/shared/components/KinderSummary";
import { type PersonItem } from "~/domains/nachlass/erbschein/shared/components/types";
import { type ArrayConfigClient } from "~/services/array";

const mockArrayConfiguration: ArrayConfigClient = {
  url: "/angehoerige/kinder",
  initialInputUrl: "data",
  disableAddButton: false,
};

const mockCategory = "kinder";

const mockDeceasedPersonName = "Max Mustermann";

vi.mock("react-router", () => ({
  useLocation: () => ({
    pathname: "/",
  }),
  useFetcher: () => ({
    Form: ({ children }: { children: React.ReactNode }) => (
      <form>{children}</form>
    ),
  }),
  useRouteLoaderData: vi.fn(),
}));

describe("KinderSummary", () => {
  it("Should render a basic summary for Erbfolge Ermitteln", () => {
    const mockItems: PersonItem[] = [
      { vorname: "Michelangelo", nachname: "Mustermann", isAlive: "yes" },
      {
        vorname: "Erika",
        nachname: "Mustermann",
        isAlive: "no",
        hatteKinder: "yes",
      },
    ];
    const { getByText, getAllByText } = render(
      <KinderSummary
        data={mockItems}
        configuration={mockArrayConfiguration}
        category={mockCategory}
        deceasedPersonName={mockDeceasedPersonName}
      />,
    );
    expect(getByText("Michelangelo Mustermann")).toBeInTheDocument();
    expect(getAllByText("Erika Mustermann").length).toBeGreaterThan(0);
    expect(getAllByText("Kind von Max Mustermann").length).toBeGreaterThan(0);
  });

  it("Should render a more detailed summary for Erbscheinsantrag data", () => {
    const mockItems: PersonItem[] = [
      {
        vorname: "Michelangelo",
        nachname: "Mustermann",
        isAlive: "yes",
        strasse: "Musterstraße",
        hausnummer: "1",
        plz: "12345",
        ort: "Musterstadt",
        land: "Deutschland",
      },
    ];
    const { getByText /* , getAllByText */ } = render(
      <KinderSummary
        data={mockItems}
        configuration={mockArrayConfiguration}
        category={mockCategory}
        deceasedPersonName={mockDeceasedPersonName}
      />,
    );
    expect(getByText("Musterstraße", { exact: false })).toBeInTheDocument();
    expect(
      getByText("12345 Musterstadt", { exact: false }),
    ).toBeInTheDocument();
    expect(getByText("Deutschland", { exact: false })).toBeInTheDocument();
  });
});
