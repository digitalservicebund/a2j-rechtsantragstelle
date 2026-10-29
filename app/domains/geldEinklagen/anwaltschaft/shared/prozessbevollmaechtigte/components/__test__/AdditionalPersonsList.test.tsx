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
import {
  MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS,
  type Berufsausuebungsgesellschaft,
  type BerufsausuebungsgesellschaftProzessbevollmaechtigt,
} from "../../prozessbevollmaechtigteSchemas";
import { AdditionalPersonsList } from "../AdditionalPersonsList";

const individualRepresentatives = {
  ...gesellschaft,
  isProzessbevollmaechtigt: "off",
  "prozessbevollmaechtigte-personen": [
    {
      ...gesellschaft.signaturangaben[0],
      anrede: "frau",
      vorname: "Maria",
      namedInSignature: "off",
    },
  ],
} satisfies Berufsausuebungsgesellschaft;

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

const renderPersons = (
  company:
    | Berufsausuebungsgesellschaft
    | BerufsausuebungsgesellschaftProzessbevollmaechtigt,
) =>
  render(
    <AdditionalPersonsList
      berufsausuebungsgesellschaft={company}
      parentArrayItemIndex={2}
      relationship="beklagte"
    />,
  );

describe.each([
  { company: gesellschaft, arrayName: "signaturangaben" },
  {
    company: individualRepresentatives,
    arrayName: "prozessbevollmaechtigte-personen",
  },
])("AdditionalPersonsList ($arrayName)", ({ company, arrayName }) => {
  it("restores focus to the edited person on returning to the overview", async () => {
    const { unmount } = renderPersons(company);
    const edit = screen.getByRole("link", { name: /bearbeiten$/i });
    expect(edit).toHaveAttribute(
      "href",
      `/geld-einklagen/anwaltschaft/beklagte-partei/prozessbevollmaechtigte/2/${arrayName}/0/daten`,
    );
    edit.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(edit);
    unmount();
    renderPersons(company);
    await waitFor(() => {
      expect(
        document.getElementById(
          `beklagte-prozessbevollmaechtigte-2-${arrayName}-0`,
        ),
      ).toHaveFocus();
    });
    expect(sessionStorage).toHaveLength(0);
  });

  it("focuses the add link after deleting the final person", async () => {
    const user = userEvent.setup();
    const deleteArrayItem = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteArrayItem).mockReturnValue(deleteArrayItem);
    const { rerender } = renderPersons(company);
    await user.click(screen.getByRole("button"));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Ja, löschen",
      }),
    );
    expect(deleteArrayItem).toHaveBeenCalledExactlyOnceWith(
      `/geld-einklagen/anwaltschaft/beklagte-partei/prozessbevollmaechtigte/2/${arrayName}`,
      0,
    );
    rerender(
      <AdditionalPersonsList
        berufsausuebungsgesellschaft={{ ...company, [arrayName]: [] }}
        parentArrayItemIndex={2}
        relationship="beklagte"
      />,
    );
    const add = screen.getByRole("link");
    expect(add).toHaveAttribute(
      "href",
      `/geld-einklagen/anwaltschaft/beklagte-partei/prozessbevollmaechtigte/2/${arrayName}/0/daten`,
    );
    await waitFor(() => expect(add).toHaveFocus());
  });

  it("hides the add link at the maximum number of persons", () => {
    renderPersons({
      ...company,
      [arrayName]: Array.from(
        { length: MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS },
        () =>
          arrayName === "signaturangaben"
            ? gesellschaft.signaturangaben[0]
            : individualRepresentatives["prozessbevollmaechtigte-personen"][0],
      ),
    });
    expect(screen.getAllByRole("link")).toHaveLength(
      MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS,
    );
    expect(
      document.getElementById(
        `beklagte-prozessbevollmaechtigte-2-${arrayName}-add`,
      ),
    ).not.toBeInTheDocument();
  });
});

describe("AdditionalPersonsList with individual representatives", () => {
  it.each(["on", "off"] as const)(
    "renders representative details with namedInSignature %s",
    (namedInSignature) => {
      renderPersons({
        ...individualRepresentatives,
        "prozessbevollmaechtigte-personen": [
          {
            ...individualRepresentatives["prozessbevollmaechtigte-personen"][0],
            namedInSignature,
            telefonnummer: "+49 30 123456",
            email: "maria@example.com",
          },
        ],
      });

      expect(
        screen.getByRole("heading", {
          name: "Prozessbevollmächtigte Personen",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Maria Musterfrau", { selector: "span" }),
      ).toHaveClass("kern-body--bold");
      expect(screen.queryByText("Erika Musterfrau")).not.toBeInTheDocument();
      expect(
        screen.getByText("(Rechtsanwältin)", { selector: "span" }),
      ).toBeInTheDocument();
      expect(screen.getByText("+49 30 123456")).toBeInTheDocument();
      expect(screen.getByText("maria@example.com")).toBeInTheDocument();
      const signatureLabel = screen.queryByText(
        "(Wird in der Signatur genannt)",
      );
      if (namedInSignature === "on") {
        expect(signatureLabel).toBeInTheDocument();
      } else {
        expect(signatureLabel).not.toBeInTheDocument();
      }
      expect(
        screen.getByRole("link", {
          name: /Prozessbevollmächtigte Personen hinzufügen/i,
        }),
      ).toHaveAttribute(
        "href",
        "/geld-einklagen/anwaltschaft/beklagte-partei/prozessbevollmaechtigte/2/prozessbevollmaechtigte-personen/1/daten",
      );
    },
  );
});
