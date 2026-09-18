import { render } from "@testing-library/react";
import { DeleteDialog } from "../DeleteDialog";

const dialogRef = { current: document.createElement("dialog") };

describe("DeleteDialog", () => {
  it("should render the delete dialog with two buttons", () => {
    const { getByText, getAllByRole } = render(
      <DeleteDialog
        description="description"
        title="title"
        onClick={vi.fn()}
        closeDialog={vi.fn()}
        dialogRef={dialogRef}
      />,
    );

    expect(getByText("description")).toBeInTheDocument();
    expect(getByText("title")).toBeInTheDocument();
    expect(getAllByRole("button")).toHaveLength(2);
  });

  it("should call onClick when the delete button is clicked", () => {
    const onClick = vi.fn();
    const { getAllByRole } = render(
      <DeleteDialog
        description="description"
        title="title"
        onClick={onClick}
        closeDialog={vi.fn()}
        dialogRef={dialogRef}
      />,
    );

    getAllByRole("button")[0].click();
    expect(onClick).toHaveBeenCalled();
  });
});
