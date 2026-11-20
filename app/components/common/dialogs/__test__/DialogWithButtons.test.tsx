import { render, screen } from "@testing-library/react";
import { DialogWithButtons } from "../DialogWithButtons";

// Needed as jsdom doesn't support the dialog API yet
// https://github.com/jsdom/jsdom/issues/3294
HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.open = true;
};

const dialogRef = { current: document.createElement("dialog") };

describe("DialogWithButtons", () => {
  it("should render the delete dialog with three buttons", () => {
    render(
      <DialogWithButtons
        description="description"
        title="title"
        leftButton={{
          description: "left button description",
          onClick: vi.fn(),
        }}
        rightButton={{
          description: "right button description",
          onClick: vi.fn(),
        }}
        closeDialog={vi.fn()}
        dialogRef={dialogRef}
      />,
    );
    dialogRef.current?.showModal();

    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByText("left button description")).toBeInTheDocument();
    expect(screen.getByText("right button description")).toBeInTheDocument();
  });

  it("should call right button click when is called", () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <DialogWithButtons
        description="description"
        title="title"
        leftButton={{
          description: "left button description",
          onClick: vi.fn(),
        }}
        rightButton={{
          description: "right button description",
          onClick: onClick,
        }}
        closeDialog={vi.fn()}
        dialogRef={dialogRef}
      />,
    );
    dialogRef.current?.showModal();

    getByRole("button", { name: "right button description" }).click();
    expect(onClick).toHaveBeenCalled();
  });

  it("should call left button click when is called", () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <DialogWithButtons
        description="description"
        title="title"
        leftButton={{
          description: "left button description",
          onClick: onClick,
        }}
        rightButton={{
          description: "right button description",
          onClick: vi.fn(),
        }}
        closeDialog={vi.fn()}
        dialogRef={dialogRef}
      />,
    );
    dialogRef.current?.showModal();

    getByRole("button", { name: "left button description" }).click();
    expect(onClick).toHaveBeenCalled();
  });
});
