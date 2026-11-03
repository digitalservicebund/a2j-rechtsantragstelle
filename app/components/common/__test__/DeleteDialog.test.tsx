import { render, screen } from "@testing-library/react";
import { DeleteDialog } from "../DeleteDialog";

// Needed as jsdom doesn't support the dialog API yet
// https://github.com/jsdom/jsdom/issues/3294
HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.open = true;
};

const dialogRef = { current: document.createElement("dialog") };

describe("DeleteDialog", () => {
  it("should render the delete dialog with three buttons", () => {
    render(
      <DeleteDialog
        description="description"
        title="title"
        onClick={vi.fn()}
        closeDialog={vi.fn()}
        dialogRef={dialogRef}
      />,
    );
    dialogRef.current?.showModal();

    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("should call onClick when the delete button is clicked", () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <DeleteDialog
        description="description"
        title="title"
        onClick={onClick}
        closeDialog={vi.fn()}
        dialogRef={dialogRef}
      />,
    );
    dialogRef.current?.showModal();

    getByRole("button", { name: "Ja, löschen" }).click();
    expect(onClick).toHaveBeenCalled();
  });
});
