import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { translations } from "~/services/translations/translations";
import { BezifferterZahlungsUndNebenantragItem } from "../BezifferterZahlungsUndNebenantragItem";

vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

const nebenantrag = {
  type: "nebenantrag",
  nebenantragArt: "mahnkosten",
  nebenantragBetrag: "100",
} as const;

const annahmeverzug = {
  type: "annahmeverzug",
  annahmeverzugsFeststellung: "on",
  annahmeverzugDatum: { day: "", month: "", year: "" },
} as const;

const antrag = {
  internesSchlagwortForderung: "Lohn",
  betragForderung: "1000",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "", year: "" },
  zinsende: { day: "", month: "", year: "" },
} as const;

const baseUrl =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege";

const deleteItem = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
  vi.mocked(useDeleteArrayItem).mockReturnValue(deleteItem);
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
  };
});

afterEach(() => {
  vi.useRealTimers();
  sessionStorage.clear();
});

describe("BezifferterZahlungsUndNebenantragItem", () => {
  it("should render a nebenantrag with the respective edit and add links", () => {
    const userData = {
      hauptantrag: [
        antrag,
        { ...antrag, nebenantraege: [annahmeverzug, nebenantrag] },
      ],
    };
    render(
      <BezifferterZahlungsUndNebenantragItem
        userData={userData}
        parentArrayItemIndex={1}
      />,
    );

    const annahmeverzugEditLink = screen.getByRole("link", {
      name: "Feststellungsantrag auf Annahmeverzug 1 bearbeiten",
    });
    const nebenantragEditLink = screen.getByRole("link", {
      name: "Nebenantrag 2 bearbeiten",
    });
    expect(annahmeverzugEditLink).toHaveAttribute(
      "href",
      `${baseUrl}/1/annahmeverzug/0/daten`,
    );
    expect(nebenantragEditLink).toHaveAttribute(
      "href",
      `${baseUrl}/1/nebenantraege/1/daten`,
    );
    expect(screen.getByText("Mahnkosten")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
      }),
    ).toHaveAttribute("href", `${baseUrl}/1/nebenantraege/2/daten`);
    expect(
      screen.queryByRole("link", {
        name: translations.geldEinklagenAnwaltschaft.annahmeverzugAddButton.de,
      }),
    ).not.toBeInTheDocument();
    nebenantragEditLink.addEventListener("click", (event) =>
      event.preventDefault(),
    );
    fireEvent.click(nebenantragEditLink);
    expect(sessionStorage.getItem("focus-nebenantrag-1")).toBe("1");
    expect(useDeleteArrayItem).toHaveBeenCalledWith(
      "hauptantrag#nebenantraege",
      "/geld-einklagen/anwaltschaft/hauptantrag/1",
      expect.any(Function),
    );
  });

  it("should hide add link when the limit is reached", () => {
    render(
      <BezifferterZahlungsUndNebenantragItem
        userData={{
          hauptantrag: [
            {
              ...antrag,
              nebenantraege: Array.from({ length: 6 }, () => nebenantrag),
            },
          ],
        }}
        parentArrayItemIndex={0}
      />,
    );
    expect(
      screen.queryByRole("link", {
        name: translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: translations.geldEinklagenAnwaltschaft.annahmeverzugAddButton.de,
      }),
    ).toHaveAttribute("href", `${baseUrl}/0/annahmeverzug/6/daten`);
  });

  it("should confirm the deletion of the selected nebenantrag", async () => {
    const user = userEvent.setup();
    render(
      <BezifferterZahlungsUndNebenantragItem
        userData={{
          hauptantrag: [
            { ...antrag, nebenantraege: [annahmeverzug, nebenantrag] },
          ],
        }}
        parentArrayItemIndex={0}
      />,
    );
    const item = document.getElementById("nebenantrag-0-1")!;
    await user.click(within(item).getByRole("button"));
    const dialog = screen.getByRole("dialog", {
      name: "Nebenantrag Mahnkosten, 100",
    });
    expect(deleteItem).not.toHaveBeenCalled();
    await user.click(
      within(dialog).getByRole("button", {
        name: translations.deleteDialog.confirm.de,
      }),
    );
    expect(deleteItem).toHaveBeenCalledExactlyOnceWith(1);
  });

  it("should restore focus after editing or deleting a nebenantrag", () => {
    vi.useFakeTimers();
    sessionStorage.setItem("focus-nebenantrag-0", "0");
    const { rerender } = render(
      <BezifferterZahlungsUndNebenantragItem
        userData={{
          hauptantrag: [{ ...antrag, nebenantraege: [nebenantrag] }],
        }}
        parentArrayItemIndex={0}
      />,
    );
    const item = document.getElementById("nebenantrag-0-0");
    act(() => vi.advanceTimersByTime(0));
    expect(item).toHaveFocus();
    expect(sessionStorage.getItem("focus-nebenantrag-0")).toBeNull();

    const focusAfterDelete = vi.mocked(useDeleteArrayItem).mock.calls[0][2]!;
    focusAfterDelete(0);
    act(() => vi.advanceTimersByTime(100));
    expect(item).toHaveFocus();
    rerender(
      <BezifferterZahlungsUndNebenantragItem
        userData={{}}
        parentArrayItemIndex={0}
      />,
    );
    focusAfterDelete(0);
    act(() => vi.advanceTimersByTime(100));
    expect(document.getElementById("nebenantrag-heading-0")).toHaveFocus();
  });
});
