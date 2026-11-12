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

const createHauptantrag = (name: string) => ({
  betragForderung: "100",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "" },
  zinsende: { day: "", month: "" },
  absaetze: [absatz(name)],
  nebenantraege: [
    {
      type: "nebenantrag" as const,
      nebenantragArt: "mahnkosten" as const,
      nebenantragBetrag: "10",
      absaetze: [absatz(`${name} Nebenantrag`)],
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
  it.each([
    { isNebenantrag: false, indexes: [1], number: 3 },
    { isNebenantrag: true, indexes: [1, 0], number: 4 },
  ])(
    "uses global numbering and updates after additions/deletions (Nebenantrag: $isNebenantrag)",
    ({ isNebenantrag, indexes, number }) => {
      const userData: GeldEinklagenAnwaltschaftUserData = {
        hauptantrag: [createHauptantrag("First"), createHauptantrag("Second")],
        pageData: { arrayIndexes: indexes },
      };
      const Stub = createRoutesStub([
        {
          id: "root",
          path: "/",
          Component: () => <AbsaetzeUebersicht isNebenantrag={isNebenantrag} />,
        },
      ]);
      const { rerender } = render(
        <TestFormFlow userData={userData}>
          <Stub />
        </TestFormFlow>,
      );

      expect(screen.getAllByText(`Beweis K${number}`)).toHaveLength(2);
      expect(
        screen.getByRole("link", { name: "Beweis Bearbeiten" }),
      ).toHaveAttribute(
        "href",
        `/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/hauptantrag/1${isNebenantrag ? "/nebenantraege/0" : ""}/absaetze/0/beweise/0/urkunde-daten`,
      );

      const withoutFirstParagraph = {
        ...userData,
        hauptantrag: [
          { ...createHauptantrag("First"), absaetze: [] },
          createHauptantrag("Second"),
        ],
      };
      rerender(
        <TestFormFlow userData={withoutFirstParagraph}>
          <Stub />
        </TestFormFlow>,
      );
      expect(screen.getAllByText(`Beweis K${number - 1}`)).toHaveLength(2);
      expect(screen.queryByText(`Beweis K${number}`)).not.toBeInTheDocument();

      rerender(
        <TestFormFlow userData={userData}>
          <Stub />
        </TestFormFlow>,
      );
      expect(screen.getAllByText(`Beweis K${number}`)).toHaveLength(2);
    },
  );
});
