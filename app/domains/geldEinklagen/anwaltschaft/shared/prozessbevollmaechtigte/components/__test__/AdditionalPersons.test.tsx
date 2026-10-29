import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { gesellschaft } from "../../__test__/fixtures";
import { MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS } from "../../prozessbevollmaechtigteSchemas";
import { AdditionalPersons } from "../AdditionalPersons";

vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
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
  sessionStorage.clear();
});

const renderPersons = (company = gesellschaft) =>
  render(
    <AdditionalPersons
      berufsausuebungsgesellschaft={company}
      parentArrayItemIndex={2}
      relationship="beklagte"
    />,
  );

describe("AdditionalPersons", () => {
  it("restores focus to the edited person on returning to the overview", async () => {
    const { unmount } = renderPersons();
    const edit = screen.getByRole("link", { name: /bearbeiten$/i });
    expect(edit).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/beklagte-partei/prozessbevollmaechtigte/2/signaturangaben/0/daten",
    );
    edit.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(edit);
    unmount();
    renderPersons();
    await waitFor(() => {
      expect(
        document.getElementById(
          "beklagte-prozessbevollmaechtigte-2-signaturangaben-0",
        ),
      ).toHaveFocus();
    });
    expect(sessionStorage.length).toBe(0);
  });

  it("focuses the add link after deleting the final person", async () => {
    const user = userEvent.setup();
    const deleteArrayItem = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteArrayItem).mockReturnValue(deleteArrayItem);
    const { rerender } = renderPersons();
    await user.click(screen.getByRole("button"));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Ja, löschen",
      }),
    );
    expect(deleteArrayItem).toHaveBeenCalledExactlyOnceWith(
      "/geld-einklagen/anwaltschaft/beklagte-partei/prozessbevollmaechtigte/2/signaturangaben",
      0,
    );
    rerender(
      <AdditionalPersons
        berufsausuebungsgesellschaft={{ ...gesellschaft, signaturangaben: [] }}
        parentArrayItemIndex={2}
        relationship="beklagte"
      />,
    );
    const add = screen.getByRole("link");
    expect(add).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/beklagte-partei/prozessbevollmaechtigte/2/signaturangaben/0/daten",
    );
    await waitFor(() => expect(add).toHaveFocus());
  });

  it("hides the add link at the maximum number of persons", () => {
    renderPersons({
      ...gesellschaft,
      signaturangaben: Array.from(
        { length: MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS },
        () => gesellschaft.signaturangaben[0],
      ),
    });
    expect(screen.getAllByRole("link")).toHaveLength(
      MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS,
    );
    expect(
      document.getElementById(
        "beklagte-prozessbevollmaechtigte-2-signaturangaben-add",
      ),
    ).not.toBeInTheDocument();
  });
});
