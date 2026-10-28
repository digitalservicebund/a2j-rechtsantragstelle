import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteButton } from "../DeleteButton";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderButton = (onDelete = vi.fn().mockResolvedValue(undefined)) => {
  render(
    <DeleteButton
      label="Eintrag löschen"
      title="Eintrag löschen?"
      description={<p>Dieser Eintrag wird entfernt.</p>}
      onDelete={onDelete}
    />,
  );
  return onDelete;
};

describe("DeleteButton", () => {
  it("only deletes after confirmation and closes after success", async () => {
    const user = userEvent.setup();
    const onDelete = renderButton();

    await user.click(screen.getByRole("button", { name: "Eintrag löschen" }));
    const dialog = screen.getByRole("dialog", { name: "Eintrag löschen?" });
    expect(dialog).toHaveAccessibleDescription("Dieser Eintrag wird entfernt.");
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole("button", { name: "Ja, löschen" }),
    );
    expect(onDelete).toHaveBeenCalledExactlyOnceWith();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each(["Nein, behalten", "Schließen"])(
    "does not delete on %s",
    async (name) => {
      const user = userEvent.setup();
      const onDelete = renderButton();
      await user.click(screen.getByRole("button", { name: "Eintrag löschen" }));
      await user.click(screen.getByRole("button", { name }));
      expect(onDelete).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    },
  );

  it("prevents duplicate submissions and dismissal while deletion is pending", async () => {
    const user = userEvent.setup();
    let resolveDelete!: () => void;
    const onDelete = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        }),
    );
    renderButton(onDelete);
    await user.click(screen.getByRole("button", { name: "Eintrag löschen" }));
    const dialog = screen.getByRole("dialog");
    const confirm = within(dialog).getByRole("button", { name: "Ja, löschen" });
    await user.click(confirm);
    expect(dialog).toHaveAttribute("aria-busy", "true");
    for (const button of within(dialog).getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
    expect(fireEvent(dialog, new Event("cancel", { cancelable: true }))).toBe(
      false,
    );
    await user.click(confirm);
    expect(onDelete).toHaveBeenCalledTimes(1);
    await act(async () => resolveDelete());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the dialog open, announces a failure and allows retry", async () => {
    const user = userEvent.setup();
    const onDelete = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(undefined);
    renderButton(onDelete);
    await user.click(screen.getByRole("button", { name: "Eintrag löschen" }));
    await user.click(screen.getByRole("button", { name: "Ja, löschen" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Das Löschen ist fehlgeschlagen.",
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ja, löschen" }));
    expect(onDelete).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses distinct accessible labels and descriptions for multiple dialogs", () => {
    renderButton();
    renderButton();
    const dialogs = screen.getAllByRole("dialog", { hidden: true });
    const labels = dialogs.map((dialog) =>
      dialog.getAttribute("aria-labelledby"),
    );
    const descriptions = dialogs.map((dialog) =>
      dialog.getAttribute("aria-describedby"),
    );
    expect(new Set([...labels, ...descriptions]).size).toBe(4);
    for (const id of [...labels, ...descriptions]) {
      expect(document.getElementById(id!)).toBeInTheDocument();
    }
  });
});
