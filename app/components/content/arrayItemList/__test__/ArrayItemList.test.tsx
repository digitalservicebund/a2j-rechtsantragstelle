import { render, screen, within } from "@testing-library/react";
import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";

describe("ArrayItemListSection", () => {
  it("renders a focusable heading, helper text, items, notice and add button", () => {
    render(
      <ArrayItemListSection
        heading="Personen"
        headingId="personen"
        helperText="Hilfetext"
        notice={<p>Maximum erreicht</p>}
        addButton={{ href: "/add", buttonText: "Person hinzufügen" }}
      >
        <p>Item</p>
      </ArrayItemListSection>,
    );

    const heading = screen.getByRole("heading", { level: 2, name: "Personen" });
    expect(heading).toHaveAttribute("id", "personen");
    expect(heading).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText("Hilfetext")).toBeInTheDocument();
    expect(screen.getByText("Item")).toBeInTheDocument();
    expect(screen.getByText("Maximum erreicht")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Person hinzufügen" }),
    ).toHaveAttribute("href", "/add");
  });
});

describe("ArrayItemCard", () => {
  it("renders heading, content, edit button, children and delete action", () => {
    render(
      <ArrayItemCard
        dataTestId="card"
        heading={{ text: "Partei 1)", id: "partei-0" }}
        content={<span>Max Mustermann</span>}
        editButton={{ id: "edit-0", href: "/edit/0", ariaLabel: "Bearbeiten" }}
        deleteButton={<button type="button">Löschen</button>}
      >
        <p>Nested</p>
      </ArrayItemCard>,
    );

    const card = screen.getByTestId("card");
    expect(
      within(card).getByRole("heading", { level: 3, name: "Partei 1)" }),
    ).toHaveAttribute("id", "partei-0");
    expect(within(card).getByText("Max Mustermann")).toBeInTheDocument();
    const editLink = within(card).getByRole("link", { name: "Bearbeiten" });
    expect(editLink).toHaveAttribute("href", "/edit/0");
    expect(editLink).toHaveAttribute("id", "edit-0");
    expect(within(card).getByText("Nested")).toBeInTheDocument();
    expect(
      within(card).getByRole("button", { name: "Löschen" }),
    ).toBeInTheDocument();
  });

  it("makes the wrapper focusable when an id is given and omits the heading", () => {
    render(
      <ArrayItemCard
        id="item-0"
        dataTestId="card"
        content="Inhalt"
        editButton={{ href: "/edit/0", ariaLabel: "Bearbeiten" }}
      />,
    );

    expect(screen.getByTestId("card")).toHaveAttribute("tabindex", "-1");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});

describe("NestedArrayItemList", () => {
  const item = {
    key: "item-0",
    id: "nested-0",
    content: <span>Erika Musterfrau</span>,
    editButton: { href: "/nested/0/daten", ariaLabel: "Erika bearbeiten" },
    deleteButton: { title: "Person löschen?", onDelete: vi.fn() },
  };

  it("renders heading with suffix, subtitle, items and add link", () => {
    render(
      <NestedArrayItemList
        heading="Gesetzliche Vertretung"
        headingId="vertretung"
        headingSuffix=" - Optional"
        subtitle="Untertitel"
        items={[item]}
        addLink={{ href: "/nested/1/daten", label: "Hinzufügen", id: "add" }}
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 4,
      name: "Gesetzliche Vertretung - Optional",
    });
    expect(heading).toHaveAttribute("id", "vertretung");
    expect(heading).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText("Untertitel")).toBeInTheDocument();
    expect(screen.getByText("Erika Musterfrau")).toBeInTheDocument();
    expect(document.getElementById("nested-0")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(
      screen.getByRole("link", { name: "Erika bearbeiten" }),
    ).toHaveAttribute("href", "/nested/0/daten");
    expect(screen.getByRole("button", { name: "" })).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
    const addLink = screen.getByRole("link", { name: "Hinzufügen" });
    expect(addLink).toHaveAttribute("href", "/nested/1/daten");
    expect(addLink).toHaveAttribute("id", "add");
  });

  it("hides the add link when none is given", () => {
    render(
      <NestedArrayItemList
        heading="Personen"
        headingId="personen"
        items={[]}
      />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
