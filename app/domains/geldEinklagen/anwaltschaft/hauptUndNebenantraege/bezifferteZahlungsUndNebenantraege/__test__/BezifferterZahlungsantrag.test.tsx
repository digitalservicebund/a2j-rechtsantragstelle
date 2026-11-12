import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { translations } from "~/services/translations/translations";
import { BezifferterZahlungsantrag } from "../BezifferterZahlungsantrag";

vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

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

const baseUrl =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege";

const antrag = {
  internesSchlagwortForderung: "Lohn",
  betragForderung: "1000",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "", year: "" },
  zinsende: { day: "", month: "", year: "" },
};
describe("BezifferterZahlungsantrag", () => {
  it("should render, edit and delete a Hauptantrag", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn().mockResolvedValue(undefined);
    const userData = { hauptantrag: [antrag, antrag] };

    render(
      <BezifferterZahlungsantrag
        itemIndex={1}
        item={antrag}
        userData={userData}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("Lohn")).toBeInTheDocument();
    expect(screen.getByText("1000 Euro")).toBeInTheDocument();
    const edit = screen.getByRole("link", {
      name: "Zahlungsantrag 2 bearbeiten",
    });
    expect(edit).toHaveAttribute("href", `${baseUrl}/hauptantrag/1/daten`);
    edit.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(edit);
    expect(onEdit).toHaveBeenCalledExactlyOnceWith(1);

    await user.click(
      screen.getByRole("button", {
        name: "Zahlungsantrag 2 und Nebenanträge löschen",
      }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Zahlungsantrag 2 löschen",
    });
    expect(dialog).toHaveTextContent("Bezifferter Zahlungsantrag 2 Lohn, 1000");
    expect(onDelete).not.toHaveBeenCalled();
    await user.click(
      within(dialog).getByRole("button", {
        name: translations.deleteDialog.confirm.de,
      }),
    );
    expect(onDelete).toHaveBeenCalledExactlyOnceWith(1);
  });
});
