import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { translations } from "~/services/translations/translations";
import { UnbezifferteSchmerzensgeldNebenantragItem } from "../UnbezifferteSchmerzensgeldNebenantragItem";

vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

const baseUrl =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege";

const nebenantrag = {
  schmerzengeldNebenantragArt: "mahnkosten",
  schmerzengeldNebenantragBetrag: "100",
} as const;

const antrag = {
  mindestBetrag: "5000",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "", year: "" },
  zinsende: { day: "", month: "", year: "" },
};

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

describe("UnbezifferteSchmerzensgeldNebenantragItem", () => {
  it("should render a nebenantrag and add the next nebenantrag item", () => {
    render(
      <UnbezifferteSchmerzensgeldNebenantragItem
        userData={{
          schmerzengeldantrag: [
            antrag,
            { ...antrag, nebenantraege: [nebenantrag, nebenantrag] },
          ],
        }}
        parentArrayItemIndex={1}
      />,
    );

    expect(screen.getAllByText("Mahnkosten")).toHaveLength(2);
    const edit = screen.getByRole("link", { name: "Nebenantrag 2 bearbeiten" });
    expect(edit).toHaveAttribute("href", `${baseUrl}/1/nebenantraege/1/daten`);
    expect(
      screen.getByRole("link", {
        name: translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
      }),
    ).toHaveAttribute("href", `${baseUrl}/1/nebenantraege/2/daten`);
    edit.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(edit);
    expect(sessionStorage.getItem("focus-schmerzensgeld-nebenantrag-1")).toBe(
      "1",
    );
    expect(useDeleteArrayItem).toHaveBeenCalledWith(
      "schmerzengeldantrag#nebenantraege",
      "/geld-einklagen/anwaltschaft/schmerzengeldantrag/1",
      expect.any(Function),
    );
  });

  it.each([5, 6])(
    "should enforce the six-item limit at %i entries",
    (count) => {
      render(
        <UnbezifferteSchmerzensgeldNebenantragItem
          userData={{
            schmerzengeldantrag: [
              {
                ...antrag,
                nebenantraege: Array.from({ length: count }, () => nebenantrag),
              },
            ],
          }}
          parentArrayItemIndex={0}
        />,
      );
      const add = screen.queryByRole("link", {
        name: translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
      });
      if (count === 5) {
        expect(add).toHaveAttribute(
          "href",
          `${baseUrl}/0/nebenantraege/5/daten`,
        );
      } else {
        expect(add).not.toBeInTheDocument();
      }
    },
  );

  it("should delete the nebenantrag after confirmation", async () => {
    const user = userEvent.setup();
    render(
      <UnbezifferteSchmerzensgeldNebenantragItem
        userData={{
          schmerzengeldantrag: [
            { ...antrag, nebenantraege: [nebenantrag, nebenantrag] },
          ],
        }}
        parentArrayItemIndex={0}
      />,
    );
    const item = document.getElementById("schmerzensgeld-nebenantrag-0-1")!;
    await user.click(within(item).getByRole("button"));
    const dialog = screen.getByRole("dialog", {
      name: translations.geldEinklagenAnwaltschaft.nebenatragDeleteButton.de,
    });
    expect(dialog).toHaveTextContent("Nebenantrag - Mahnkosten, 100 Euro");
    expect(deleteItem).not.toHaveBeenCalled();
    await user.click(
      within(dialog).getByRole("button", {
        name: translations.deleteDialog.confirm.de,
      }),
    );
    expect(deleteItem).toHaveBeenCalledExactlyOnceWith(1);
  });

  it("should restore focus after editing and deletion", () => {
    vi.useFakeTimers();
    sessionStorage.setItem("focus-schmerzensgeld-nebenantrag-0", "0");
    const { rerender } = render(
      <UnbezifferteSchmerzensgeldNebenantragItem
        userData={{
          schmerzengeldantrag: [{ ...antrag, nebenantraege: [nebenantrag] }],
        }}
        parentArrayItemIndex={0}
      />,
    );
    const item = document.getElementById("schmerzensgeld-nebenantrag-0-0");
    act(() => vi.advanceTimersByTime(0));
    expect(item).toHaveFocus();
    expect(
      sessionStorage.getItem("focus-schmerzensgeld-nebenantrag-0"),
    ).toBeNull();

    const focusAfterDelete = vi.mocked(useDeleteArrayItem).mock.calls[0][2]!;
    focusAfterDelete(0);
    act(() => vi.advanceTimersByTime(100));
    expect(item).toHaveFocus();
    rerender(
      <UnbezifferteSchmerzensgeldNebenantragItem
        userData={{}}
        parentArrayItemIndex={0}
      />,
    );
    focusAfterDelete(0);
    act(() => vi.advanceTimersByTime(100));
    expect(
      document.getElementById("schmerzensgeld-nebenantrag-heading-0"),
    ).toHaveFocus();
  });
});
