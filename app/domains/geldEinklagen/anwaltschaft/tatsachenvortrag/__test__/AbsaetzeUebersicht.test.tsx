import { act, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode, useMemo, type PropsWithChildren } from "react";
import { createRoutesStub } from "react-router";
import { FormFlowContext } from "~/components/hooks/formFlowContext";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { AbsaetzeUebersicht } from "../components/AbsaetzeUebersicht";
import { absaetzeFocusKey } from "../absaetzeContext";
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
  afterEach(() => {
    sessionStorage.clear();
    vi.useRealTimers();
  });

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

  it("restores focus to the edited Absatz and consumes only its overview's target", () => {
    vi.useFakeTimers();
    const userData: GeldEinklagenAnwaltschaftUserData = {
      hauptantrag: [hauptantrag("first", "first-neben")],
      vortraege: [{ antragId: "first", absaetze: [absatz("Document")] }],
      pageData: { arrayIndexes: [0] },
    };
    const Stub = createRoutesStub([
      { id: "root", path: "/", Component: () => <AbsaetzeUebersicht /> },
    ]);
    const page = (
      <StrictMode>
        <TestFormFlow userData={userData}>
          <Stub />
        </TestFormFlow>
      </StrictMode>
    );
    const otherKey = absaetzeFocusKey("/another-overview");
    sessionStorage.setItem(otherKey, "absatz-1|absatz-1");
    const { unmount } = render(page);
    const edit = screen.getByRole("link", { name: "Absatz 1 Bearbeiten" });
    edit.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    fireEvent.click(edit);
    unmount();

    render(page);
    act(() => vi.runAllTimers());
    expect(document.getElementById("absatz-0")).toHaveFocus();
    expect(
      sessionStorage.getItem(
        absaetzeFocusKey(
          "/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/vortraege/0/absaetze",
        ),
      ),
    ).toBeNull();
    expect(sessionStorage.getItem(otherKey)).toBe("absatz-1|absatz-1");
  });

  it.each([0, 1])(
    "focuses a newly added Absatz after %i existing Absaetze",
    (existingCount) => {
      vi.useFakeTimers();
      const baseUrl =
        "/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/vortraege/0/absaetze";
      const existing = Array.from({ length: existingCount }, () =>
        absatz("Document"),
      );
      const userData: GeldEinklagenAnwaltschaftUserData = {
        hauptantrag: [hauptantrag("first", "first-neben")],
        vortraege: [{ antragId: "first", absaetze: existing }],
        pageData: { arrayIndexes: [0] },
      };
      const Stub = createRoutesStub([
        { id: "root", path: "/", Component: () => <AbsaetzeUebersicht /> },
      ]);
      const { unmount } = render(
        <TestFormFlow userData={userData}>
          <Stub />
        </TestFormFlow>,
      );
      const add = screen.getByTestId("add-array-item");
      add.addEventListener("click", (event) => event.preventDefault(), {
        once: true,
      });
      fireEvent.click(add);
      unmount();

      render(
        <StrictMode>
          <TestFormFlow
            userData={{
              ...userData,
              vortraege: [
                { antragId: "first", absaetze: [...existing, absatz("New")] },
              ],
            }}
          >
            <Stub />
          </TestFormFlow>
        </StrictMode>,
      );
      act(() => vi.runAllTimers());
      expect(document.getElementById(`absatz-${existingCount}`)).toHaveFocus();
      expect(sessionStorage.getItem(absaetzeFocusKey(baseUrl))).toBeNull();
    },
  );

  it("focuses a newly added evidence item or its heading if it was not saved", () => {
    vi.useFakeTimers();
    const baseUrl =
      "/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/vortraege/0/absaetze";
    const userData: GeldEinklagenAnwaltschaftUserData = {
      hauptantrag: [hauptantrag("first", "first-neben")],
      vortraege: [{ antragId: "first", absaetze: [absatz("Document")] }],
      pageData: { arrayIndexes: [0] },
    };
    const Stub = createRoutesStub([
      { id: "root", path: "/", Component: () => <AbsaetzeUebersicht /> },
    ]);
    const page = (
      <TestFormFlow userData={userData}>
        <Stub />
      </TestFormFlow>
    );
    const { unmount } = render(page);
    const form = screen.getByTestId("select").closest("form")!;
    form.addEventListener("submit", (event) => event.preventDefault());
    fireEvent.submit(form);
    expect(sessionStorage.getItem(absaetzeFocusKey(baseUrl))).toBeNull();

    fireEvent.change(screen.getByTestId("select"), {
      target: { value: "urkunde" },
    });
    fireEvent.submit(form);
    expect(sessionStorage.getItem(absaetzeFocusKey(baseUrl))).toBe(
      "absatz-0-beweisangebote-1|absatz-0-beweisangebote",
    );
    unmount();

    const addedData = {
      ...userData,
      vortraege: [
        {
          antragId: "first",
          absaetze: [
            {
              formulierung: "Sachverhalt",
              beweise: [
                { type: "urkunde" as const, beschreibung: "Document" },
                { type: "urkunde" as const, beschreibung: "New document" },
              ],
            },
          ],
        },
      ],
    };
    const { unmount: unmountAdded } = render(
      <TestFormFlow userData={addedData}>
        <Stub />
      </TestFormFlow>,
    );
    act(() => vi.runAllTimers());
    expect(document.getElementById("absatz-0-beweisangebote-1")).toHaveFocus();
    unmountAdded();

    sessionStorage.setItem(
      absaetzeFocusKey(baseUrl),
      "absatz-0-beweisangebote-1|absatz-0-beweisangebote",
    );
    render(page);
    act(() => vi.runAllTimers());
    expect(document.getElementById("absatz-0-beweisangebote")).toHaveFocus();
  });

  it("returns focus to the edited evidence row", () => {
    vi.useFakeTimers();
    const userData: GeldEinklagenAnwaltschaftUserData = {
      hauptantrag: [hauptantrag("first", "first-neben")],
      vortraege: [{ antragId: "first", absaetze: [absatz("Document")] }],
      pageData: { arrayIndexes: [0] },
    };
    const Stub = createRoutesStub([
      { id: "root", path: "/", Component: () => <AbsaetzeUebersicht /> },
    ]);
    const page = (
      <TestFormFlow userData={userData}>
        <Stub />
      </TestFormFlow>
    );
    const { unmount } = render(page);
    const edit = screen.getByRole("link", { name: "Beweis Bearbeiten" });
    edit.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    fireEvent.click(edit);
    unmount();
    render(page);
    act(() => vi.runAllTimers());
    expect(document.getElementById("absatz-0-beweisangebote-0")).toHaveFocus();
  });
});
