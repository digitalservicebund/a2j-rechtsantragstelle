// @vitest-environment jsdom
import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import AirlineDetailsOverviewCard from "../AirlineDetailsOverviewCard";

describe("AirlineDetailsOverviewCard", () => {
  it("renders the card with airline details", () => {
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <AirlineDetailsOverviewCard
            data={{
              name: "Mock Airline",
              adresse: "123 Mock Street",
              postleitzahl: "12345",
              ort: "Mock City",
            }}
            title="Airline Information"
            buttonUrl="/edit-airline"
          />
        ),
      },
    ]);

    render(<RemixStub />);

    expect(screen.getByText("Airline Information")).toBeInTheDocument();
    expect(screen.getByText("Mock Airline")).toBeInTheDocument();
    expect(screen.getByText("123 Mock Street")).toBeInTheDocument();
    expect(screen.getByText("12345 Mock City")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bearbeiten" })).toHaveAttribute(
      "href",
      "/edit-airline",
    );
  });

  it("renders nothing when data is empty", () => {
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <AirlineDetailsOverviewCard
            data={{}}
            title="Airline Information"
            buttonUrl="/edit-airline"
          />
        ),
      },
    ]);

    const { container } = render(<RemixStub />);
    expect(container.firstChild).toBeNull();
  });

  it("handles missing fields", () => {
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <AirlineDetailsOverviewCard
            data={{
              name: "Mock Airline",
              adresse: undefined,
              postleitzahl: undefined,
              ort: undefined,
            }}
            title="Airline Information"
            buttonUrl="/edit-airline"
          />
        ),
      },
    ]);

    render(<RemixStub />);

    expect(screen.getByText("Airline Information")).toBeInTheDocument();
    expect(screen.getByText("Mock Airline")).toBeInTheDocument();
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
  });
});
