import { render, screen } from "@testing-library/react";
import { useMemo, type PropsWithChildren } from "react";
import { createRoutesStub } from "react-router";
import { FormFlowContext } from "~/components/hooks/formFlowContext";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { AbsaetzeUebersicht } from "../components/AbsaetzeUebersicht";
import type { Absatz } from "../tatsachenvortragSchemas";

const absatz = (beschreibung: string): Absatz => ({
  formulierung: "Sachverhalt",
  beweise: [{ type: "urkunde", beschreibung }],
});

const hauptantrag = (id: string, nebenantragId: string) => ({
  id,
  betragForderung: "100",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "" },
  zinsende: { day: "", month: "" },
  nebenantraege: [
    {
      id: nebenantragId,
      type: "nebenantrag" as const,
      nebenantragArt: "mahnkosten" as const,
      nebenantragBetrag: "10",
    },
  ],
});

const TestFormFlow = ({
  userData,
  children,
}: PropsWithChildren<{ userData: GeldEinklagenAnwaltschaftUserData }>) => {
  const value = useMemo(
    () => ({
      userData,
      flowId: "/geld-einklagen/anwaltschaft" as const,
      translations: {},
      validFlowPages: {},
    }),
    [userData],
  );
  return (
    <FormFlowContext.Provider value={value}>
      {children}
    </FormFlowContext.Provider>
  );
};

describe("AbsaetzeUebersicht", () => {
  it("uses global numbering in Antrag order and updates after deletions", () => {
    // The current Vortrag (index 0) belongs to the second Hauptantrag, so its
    // document follows those of the first Hauptantrag and its Nebenantrag.
    const vortraege = [
      { antragId: "second", absaetze: [absatz("Second")] },
      { antragId: "first", absaetze: [absatz("First")] },
      { antragId: "first-neben", absaetze: [absatz("First Nebenantrag")] },
    ];
    const userData: GeldEinklagenAnwaltschaftUserData = {
      hauptantrag: [
        hauptantrag("first", "first-neben"),
        hauptantrag("second", "second-neben"),
      ],
      vortraege,
      pageData: { arrayIndexes: [0] },
    };
    const Stub = createRoutesStub([
      { id: "root", path: "/", Component: () => <AbsaetzeUebersicht /> },
    ]);
    const { rerender } = render(
      <TestFormFlow userData={userData}>
        <Stub />
      </TestFormFlow>,
    );

    expect(screen.getAllByText("Beweis K3")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Beweis Bearbeiten" }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/vortraege/0/absaetze/0/beweise/0/urkunde-daten",
    );

    rerender(
      <TestFormFlow
        userData={{
          ...userData,
          vortraege: [vortraege[0], { antragId: "first", absaetze: [] }],
        }}
      >
        <Stub />
      </TestFormFlow>,
    );
    expect(screen.getAllByText("Beweis K1")).toHaveLength(2);
    expect(screen.queryByText("Beweis K3")).not.toBeInTheDocument();
  });
});
