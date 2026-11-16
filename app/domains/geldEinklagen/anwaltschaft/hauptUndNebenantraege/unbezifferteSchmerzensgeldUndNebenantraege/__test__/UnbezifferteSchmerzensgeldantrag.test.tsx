import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { translations } from "~/services/translations/translations";
import { UnbezifferteSchmerzensgeldantrag } from "../UnbezifferteSchmerzensgeldantrag";

vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

const antrag = {
  internesSchlagwortForderung: "Unfall",
  mindestBetrag: "5000",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "", year: "" },
  zinsende: { day: "", month: "", year: "" },
};

beforeEach(() => {
  vi.mocked(useDeleteArrayItem).mockReturnValue(
    vi.fn().mockResolvedValue(undefined),
  );
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
  };
});

afterEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe("UnbezifferteSchmerzensgeldantrag", () => {
  it("should render, edit or delete a schmerzensgeldantrag", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(
      <UnbezifferteSchmerzensgeldantrag
        itemIndex={1}
        antragNumber={4}
        item={antrag}
        userData={{ schmerzengeldantrag: [antrag, antrag] }}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("Unfall")).toBeInTheDocument();
    expect(screen.getByText("5000").parentElement).toHaveTextContent(
      "5000 Euro nicht unterschreiten sollte",
    );
    const edit = screen.getByRole("link", {
      name: "Schmerzensgeldantrag 4 bearbeiten",
    });
    expect(edit).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege/1/daten",
    );
    edit.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(edit);
    expect(onEdit).toHaveBeenCalledExactlyOnceWith(1);

    await user.click(
      screen.getByRole("button", {
        name: "Schmerzensgeldantrag 4 und Nebenanträge löschen",
      }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Schmerzensgeldantrag 4 löschen?",
    });
    expect(dialog).toHaveTextContent("Unfall");
    expect(dialog).toHaveTextContent("5000 Euro");
    expect(onDelete).not.toHaveBeenCalled();
    await user.click(
      within(dialog).getByRole("button", {
        name: translations.deleteDialog.confirm.de,
      }),
    );
    expect(onDelete).toHaveBeenCalledExactlyOnceWith(1);
  });
});
