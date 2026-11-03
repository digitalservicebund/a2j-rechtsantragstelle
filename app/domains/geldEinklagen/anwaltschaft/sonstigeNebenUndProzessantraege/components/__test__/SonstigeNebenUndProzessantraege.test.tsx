import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SonstigeNebenUndProzessantraege from "../SonstigeNebenUndProzessantraege";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
  };
});

describe("SonstigeNebenUndProzessantraege deletion", () => {
  it.each(["Internes Schlagwort", undefined])(
    "preserves the confirmation content with keyword %s",
    async (internesSchlagwort) => {
      const user = userEvent.setup();
      const onDelete = vi.fn().mockResolvedValue(undefined);
      render(
        <SonstigeNebenUndProzessantraege
          itemIndex={3}
          item={{ antrag: "Mein Antrag", internesSchlagwort }}
          onDelete={onDelete}
        />,
      );
      await user.click(
        screen.getByRole("button", { name: "Antrag/Ausführung löschen?" }),
      );
      const dialog = screen.getByRole("dialog", {
        name: "Antrag/Ausführung löschen?",
      });
      expect(
        within(dialog).getByText("Folgendes wird entfernt:"),
      ).toBeInTheDocument();
      expect(within(dialog).getByText("Mein Antrag")).toBeInTheDocument();
      if (internesSchlagwort) {
        expect(
          within(dialog).getByText(internesSchlagwort),
        ).toBeInTheDocument();
      }
      expect(onDelete).not.toHaveBeenCalled();
      await user.click(
        within(dialog).getByRole("button", { name: "Ja, löschen" }),
      );
      expect(onDelete).toHaveBeenCalledExactlyOnceWith(3);
    },
  );
});
