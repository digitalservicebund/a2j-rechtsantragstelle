import { render, fireEvent } from "@testing-library/react";
import Accordion from "../Accordion";
import type { AccordionItemProps } from "../AccordionItem";

const dummyItems = [
  { title: "Item 1", description: "Description 1" },
  { title: "Item 2", description: "Description 2" },
  { title: "Item 3", description: "Description 3" },
] as const satisfies AccordionItemProps[];

describe("Accordion Component", () => {
  it("renders the correct number of AccordionItem components", () => {
    const { getAllByRole } = render(<Accordion items={dummyItems} />);
    const summaries = getAllByRole("button");
    const descriptions = getAllByRole("group");
    expect(summaries).toHaveLength(dummyItems.length);
    expect(descriptions).toHaveLength(dummyItems.length);
  });

  it("allows toggling so that only one AccordionItem is open at a time", () => {
    const { getAllByRole } = render(<Accordion items={dummyItems} />);
    const summaries = getAllByRole("button");
    const descriptions = getAllByRole("group").map(
      (item) => item.childNodes[1],
    );

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
});
