import { render, screen } from "@testing-library/react";
import { DeletionDialog } from "~/domains/geldEinklagen/anwaltschaft/shared/components/DeletionDialog";

const baseProps = {
  description: "Folgendes wird gelöscht:",
  itemIcon: "draft",
  itemLabel: "Antrag 1",
} as const;

describe("DeletionDialog", () => {
  it("renders the description and item label without a warning", () => {
    render(<DeletionDialog {...baseProps} />);

    expect(screen.getByText("Folgendes wird gelöscht:")).toBeInTheDocument();
    expect(screen.getByText("Antrag 1")).toBeInTheDocument();
    expect(screen.queryByText("Achtung")).not.toBeInTheDocument();
  });

  it("renders the warning notice with its texts when a warning is given", () => {
    render(
      <DeletionDialog
        {...baseProps}
        warning={{
          title: "Achtung",
          auswirkungenText: "Auswirkungen-Text",
          keepAndEditText: "Bearbeiten-Text",
          deletePermanentlyText: "Löschen-Text",
        }}
      />,
    );

    expect(screen.getByText("Achtung")).toBeInTheDocument();
    expect(screen.getByText("Auswirkungen-Text")).toBeInTheDocument();
    expect(screen.getByText("Bearbeiten-Text")).toBeInTheDocument();
    expect(screen.getByText("Löschen-Text")).toBeInTheDocument();
  });
});
