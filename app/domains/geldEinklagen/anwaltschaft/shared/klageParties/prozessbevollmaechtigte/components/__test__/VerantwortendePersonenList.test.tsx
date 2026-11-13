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
import { type Berufsausuebungsgesellschaft } from "../../prozessbevollmaechtigteSchemas";
import { VerantwortendePersonenList } from "../VerantwortendePersonenList";
import { MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";
import { translations } from "~/services/translations/translations";

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

const renderPersons = (company: Berufsausuebungsgesellschaft) =>
  render(
    <VerantwortendePersonenList
      berufsausuebungsgesellschaft={company}
      parentArrayItemIndex={2}
    />,
  );

describe.each([
  {
    company: gesellschaft,
    person: gesellschaft["verantwortende-personen"][0],
  },
] as const)("VerantwortendePersonenList", ({ company, person }) => {
  it("restores focus to the edited person on returning to the overview", async () => {
    const { unmount } = renderPersons(company);
    const edit = screen.getByRole("link", { name: /bearbeiten$/i });
    expect(edit).toHaveAttribute(
      "href",
      `/geld-einklagen/anwaltschaft/klagende-partei/prozessbevollmaechtigte/2/verantwortende-personen/0/daten`,
    );
    edit.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(edit);
    unmount();
    renderPersons(company);
    await waitFor(() => {
      expect(
        document.getElementById(
          `klagende-prozessbevollmaechtigte-2-verantwortende-personen-0`,
        ),
      ).toHaveFocus();
    });
    expect(sessionStorage).toHaveLength(0);
  });

  it("focuses the add link after deleting the final person", async () => {
    const user = userEvent.setup();
    const deleteArrayItem = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteArrayItem).mockImplementation(
      (_arrayName, _arrayUrl, focusFunction) => async (index) => {
        await deleteArrayItem(index);
        focusFunction?.(index);
      },
    );
    const { rerender } = renderPersons(company);
    await user.click(screen.getByRole("button"));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Ja, löschen",
      }),
    );
    expect(deleteArrayItem).toHaveBeenCalledExactlyOnceWith(0);
    rerender(
      <VerantwortendePersonenList
        berufsausuebungsgesellschaft={{
          ...company,
          ["verantwortende-personen"]: [],
        }}
        parentArrayItemIndex={2}
      />,
    );
    const add = screen.getByRole("link");
    expect(add).toHaveAttribute(
      "href",
      `/geld-einklagen/anwaltschaft/klagende-partei/prozessbevollmaechtigte/2/verantwortende-personen/0/daten`,
    );
    await waitFor(() => expect(add).toHaveFocus());
  });

  it("hides the add link at the maximum number of persons", () => {
    renderPersons({
      ...company,
      ["verantwortende-personen"]: Array.from(
        { length: MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS },
        () => person,
      ),
    });
    expect(screen.getAllByRole("link")).toHaveLength(
      MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS,
    );
    expect(
      document.getElementById(
        `prozessbevollmaechtigte-2-verantwortende-personen-add`,
      ),
    ).not.toBeInTheDocument();
  });
});

describe("VerantwortendePersonenList details", () => {
  it("renders the responsible person's name and professional title", () => {
    renderPersons(gesellschaft);

    expect(
      screen.getByRole("heading", {
        name: translations.geldEinklagenAnwaltschaft.verantwortendePersonen.de,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Erika Musterfrau", { selector: "span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("(Rechtsanwältin)", { selector: "span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /Verantwortende Person hinzufügen/i,
      }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/prozessbevollmaechtigte/2/verantwortende-personen/1/daten",
    );
  });
});
