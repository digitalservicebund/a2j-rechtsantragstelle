import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import type { props as AccordionProps } from "~/components/AccordionItem";
import Accordion from "../Accordion";

const dummyItems = [
  { title: "Item 1", description: "Description 1", id: 1 },
  { title: "Item 2", description: "Description 2", id: 2 },
  { title: "Item 3", description: "Description 3", id: 3 },
];

vi.mock("~/components/AccordionItem", () => ({
  __esModule: true,
  default: ({
    title,
    description,
    isOpen,
    onToggle,
    jsEnabled,
  }: AccordionProps) => (
    <div data-testid="accordion-item">
      <div data-testid="accordion-title">{title}</div>
      <div data-testid="accordion-description">{isOpen ? description : ""}</div>
      <button data-testid="accordion-toggle" onClick={onToggle}>
        Toggle
      </button>
      <div data-testid="js-enabled">{jsEnabled ? "true" : "false"}</div>
    </div>
  ),
}));

describe("Accordion Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing if items array is empty", () => {
    const { container } = render(<Accordion items={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("renders the section tag", () => {
    render(<Accordion items={dummyItems} />);
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("renders the correct number of AccordionItem components", () => {
    render(<Accordion items={dummyItems} />);
    const accordionItems = screen.getAllByTestId("accordion-item");
    expect(accordionItems).toHaveLength(dummyItems.length);
  });

  it("passes jsEnabled as true to each AccordionItem after mount", () => {
    render(<Accordion items={dummyItems} />);
    const jsEnabledIndicators = screen.getAllByTestId("js-enabled");
    jsEnabledIndicators.forEach((indicator) => {
      expect(indicator).toHaveTextContent("true");
    });
  });

  it("allows toggling so that only one AccordionItem is open at a time", () => {
    render(<Accordion items={dummyItems} />);
    const toggleButtons = screen.getAllByTestId("accordion-toggle");
    const descriptions = screen.getAllByTestId("accordion-description");

    descriptions.forEach((desc) => {
      expect(desc.textContent).toBe("");
    });

    fireEvent.click(toggleButtons[0]);
    expect(descriptions[0].textContent).toBe("Description 1");
    expect(descriptions[1].textContent).toBe("");
    expect(descriptions[2].textContent).toBe("");

    fireEvent.click(toggleButtons[1]);
    expect(descriptions[0].textContent).toBe("");
    expect(descriptions[1].textContent).toBe("Description 2");
    expect(descriptions[2].textContent).toBe("");

    fireEvent.click(toggleButtons[1]);
    expect(descriptions[1].textContent).toBe("");
  });
});
