import { fireEvent } from "@testing-library/react";
import { renderWithRouter } from "../../__test__/renderWithRouter";
import Accordion from "../Accordion";
import type { AccordionItemProps } from "../AccordionItem";

const dummyItems = [
  { title: "Item 1", description: "Description 1" },
  { title: "Item 2", description: "Description 2" },
  { title: "Item 3", description: "Description 3" },
] as const satisfies AccordionItemProps[];

describe("Accordion Component", () => {
  it("renders the correct number of details", () => {
    const { getAllByRole } = renderWithRouter(<Accordion items={dummyItems} />);
    expect(getAllByRole("group")).toHaveLength(dummyItems.length);
  });

  it("allows toggling so that only one AccordionItem is open at a time", () => {
    const { getAllByRole } = renderWithRouter(<Accordion items={dummyItems} />);
    const details = getAllByRole("group");
    const summaries = details.map((item) => item.childNodes[0]);
    const descriptions = details.map((item) => item.childNodes[1]);

    descriptions.forEach((desc) => {
      expect(desc).not.toBeVisible();
    });

    fireEvent.click(summaries[0]);
    expect(descriptions[0]).toBeVisible();
    expect(descriptions[1]).not.toBeVisible();
    expect(descriptions[2]).not.toBeVisible();

    fireEvent.click(summaries[1]);
    expect(descriptions[0]).not.toBeVisible();
    expect(descriptions[1]).toBeVisible();
    expect(descriptions[2]).not.toBeVisible();

    fireEvent.click(summaries[1]);
    expect(descriptions[0]).not.toBeVisible();
    expect(descriptions[1]).not.toBeVisible();
    expect(descriptions[2]).not.toBeVisible();
  });

  it("doesn't rendern empty items", () => {
    const { getAllByRole } = renderWithRouter(
      <Accordion
        items={[
          { title: "title1", description: "" },
          { title: "", description: "hallo" },
          { title: "", description: "" },
        ]}
      />,
    );
    const details = getAllByRole("group");
    expect(details).toHaveLength(2);
  });

  it("applies translations", () => {
    const { getAllByText } = renderWithRouter(<Accordion items={dummyItems} />);
    getAllByText("Einblenden").forEach((el) => expect(el).toBeVisible());
  });

  it("expands details if print url param is set", () => {
    const { getAllByRole } = renderWithRouter(
      <Accordion items={dummyItems} />,
      "/?print",
    );
    const detailsElements = getAllByRole("group", { hidden: true });
    detailsElements.forEach((el) => expect(el).toHaveAttribute("open"));
  });
});
