import { fireEvent } from "@testing-library/react";
import { renderWithRouter } from "../../__test__/renderWithRouter";
import KernAccordion, {
  type KernAccordionItemProps,
} from "~/components/kern/KernAccordion";

const dummyItems = [
  { title: "Item 1", description: "Description 1" },
  { title: "Item 2", description: "Description 2" },
  { title: "Item 3", description: "Description 3" },
] as const satisfies KernAccordionItemProps[];

describe("Accordion Component", () => {
  it("should render the correct number of details", () => {
    const { getAllByRole } = renderWithRouter(
      <KernAccordion items={dummyItems} />,
    );
    expect(getAllByRole("group")).toHaveLength(dummyItems.length);
  });

  it("should toggle each accordion item independently", () => {
    const { getAllByRole } = renderWithRouter(
      <KernAccordion items={dummyItems} />,
    );
    const details = getAllByRole("group") as HTMLDetailsElement[];
    const summaries = details.map((item) => item.querySelector("summary"));

    // accordion is closed
    details.forEach((item) => {
      expect(item.open).toBe(false);
    });

    // open first accordion
    fireEvent.click(summaries[0]!);
    expect(details[0].open).toBe(true);

    // open second accordion
    fireEvent.click(summaries[1]!);
    expect(details[0].open).toBe(true);
    expect(details[1].open).toBe(true);

    // close second accordion
    fireEvent.click(summaries[1]!);
    expect(details[1].open).toBe(false);
  });

  it("should not render empty items", () => {
    const { getAllByRole } = renderWithRouter(
      <KernAccordion
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

  it("should expand the accordion when print url param is set", () => {
    const { getAllByRole } = renderWithRouter(
      <KernAccordion items={dummyItems} />,
      "/?print",
    );
    const detailsElements = getAllByRole("group", { hidden: true });
    detailsElements.forEach((el) => expect(el).toHaveAttribute("open"));
  });
});
