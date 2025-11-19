import { render, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import SummarySection from "../SummarySection";
import type { SummaryItem } from "~/services/summary/types";

vi.mock("~/components/common/StandaloneLink", () => ({
  StandaloneLink: vi.fn(({ url, text, icon }) => (
    <a href={url} data-testid="edit-link">
      {icon}
      {text}
    </a>
  )),
}));

describe("SummarySection", () => {
  const mockItem: SummaryItem = {
    id: "section1",
    title: "Personal Data",
    fields: [
      {
        id: "field1",
        question: "What is your name?",
        answer: "John Doe",
        editUrl: "/edit/name",
      },
      {
        id: "field2",
        question: "What is your age?",
        answer: "30",
      },
    ],
  };

  const mockItemWithMultipleQuestions: SummaryItem = {
    id: "section2",
    title: "Child Information",
    fields: [
      {
        id: "child1",
        question: "",
        answer: "",
        multipleQuestions: [
          {
            id: "q1",
            question: "Child's first name?",
            answer: "Alice",
          },
          {
            id: "q2",
            question: "Child's age?",
            answer: "8",
          },
        ],
        editUrl: "/edit/child/1",
      },
    ],
  };

  it("should render section title", () => {
    const { getByText } = render(
      <SummarySection item={mockItem} itemId="section1" />,
    );

    expect(getByText("Personal Data")).toBeInTheDocument();
  });

  it("should render expand/collapse controls", () => {
    const { getByText } = render(
      <SummarySection item={mockItem} itemId="section1" />,
    );

    expect(getByText("Einblenden")).toBeInTheDocument();
  });

  it("should render field questions and answers", () => {
    const { getByText } = render(
      <SummarySection item={mockItem} itemId="section1" startOpened={true} />,
    );

    expect(getByText("What is your name?")).toBeInTheDocument();
    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("What is your age?")).toBeInTheDocument();
    expect(getByText("30")).toBeInTheDocument();
  });

  it("should render multiple questions when available", () => {
    const { getByText } = render(
      <SummarySection
        item={mockItemWithMultipleQuestions}
        itemId="section2"
        startOpened={true}
      />,
    );

    expect(getByText("Child's first name?")).toBeInTheDocument();
    expect(getByText("Alice")).toBeInTheDocument();
    expect(getByText("Child's age?")).toBeInTheDocument();
    expect(getByText("8")).toBeInTheDocument();
  });

  it("should call onToggle when section is toggled", () => {
    const onToggleMock = vi.fn();
    const { container } = render(
      <SummarySection
        item={mockItem}
        itemId="section1"
        onToggle={onToggleMock}
      />,
    );

    const details = container.querySelector("details");
    expect(details).toBeInTheDocument();

    fireEvent(details!, new Event("toggle", { bubbles: true }));
    expect(onToggleMock).toHaveBeenCalledWith("section1", expect.any(Boolean));
  });
});
