import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormFlowContext } from "~/components/hooks/formFlowContext";
import SonstigeAntraege from "../SonstigeAntraege";
import { translations } from "~/services/translations/translations";

const warningCases = [true, false].map((hasLinkedVortrag) => ({
  hasLinkedVortrag,
  context: {
    flowId: "/geld-einklagen/anwaltschaft" as const,
    translations: {},
    validFlowPages: {},
    userData: {
      vortraege: [
        { antragId: "unrelated" },
        ...(hasLinkedVortrag ? [{ antragId: "target" }] : []),
      ],
    },
  },
}));

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
  };
});

describe("SonstigeAntraege deletion", () => {
  it("Allows deletion of a SonstigeAntraege item", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockResolvedValue(undefined);
    const onEdit = vi.fn();
    render(
      <SonstigeAntraege
        itemIndex={3}
        antragNumber={5}
        item={{ antrag: "Mein Antrag" }}
        onDelete={onDelete}
        onEdit={onEdit}
      />,
    );
    await user.click(
      screen.getByRole("button", { name: "Antrag/Ausführung 5 löschen" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Antrag/Ausführung 5 löschen?",
    });
    expect(
      within(dialog).getByText("Folgendes wird entfernt:"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        `${translations.geldEinklagenAnwaltschaft.soenstigeProzessantragItem.de} 5`,
      ),
    ).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
    await user.click(
      within(dialog).getByRole("button", { name: "Ja, löschen" }),
    );
    expect(onDelete).toHaveBeenCalledExactlyOnceWith(3);
  });

  it.each(warningCases)(
    "shows the warning only when a Vortrag is linked to the Antrag: $hasLinkedVortrag",
    async ({ hasLinkedVortrag, context }) => {
      const user = userEvent.setup();
      const strings = translations.geldEinklagenAnwaltschaft;
      const onDelete = vi.fn();
      render(
        <FormFlowContext.Provider value={context}>
          <SonstigeAntraege
            itemIndex={3}
            antragNumber={5}
            item={{
              id: "target",
              antrag: "Mein Antrag",
              internesSchlagwort: "Kosten",
            }}
            onDelete={onDelete}
            onEdit={vi.fn()}
          />
        </FormFlowContext.Provider>,
      );

      await user.click(
        screen.getByRole("button", { name: "Antrag/Ausführung 5 löschen" }),
      );

      const dialog = within(screen.getByRole("dialog"));
      expect(dialog.getByText("Antrag/Ausführung 5 (Kosten)")).toBeVisible();
      if (hasLinkedVortrag) {
        expect(
          dialog.getByText(strings.antragDeletionWarning.de),
        ).toBeVisible();
        expect(
          dialog.getByText(strings.antragDeletionAuswirkungen.de),
        ).toBeVisible();
        expect(dialog.getByText(strings.keepAndEditAntrag.de)).toBeVisible();
        expect(
          dialog.getByText(strings.deleteAntragPermanently.de),
        ).toBeVisible();
      } else {
        expect(
          dialog.queryByText(strings.antragDeletionWarning.de),
        ).not.toBeInTheDocument();
      }
      expect(onDelete).not.toHaveBeenCalled();
    },
  );
});
