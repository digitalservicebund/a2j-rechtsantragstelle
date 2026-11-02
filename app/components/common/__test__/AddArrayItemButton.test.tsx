import { render, screen } from "@testing-library/react";
import { AddArrayItemButton } from "~/components/common/AddArrayItemButton";

describe("AddArrayItemButton", () => {
  it("renders a link with the provided text and href", () => {
    render(
      <AddArrayItemButton
        href="/abschnitt-hinzufuegen"
        buttonText="Weiteren Abschnitt hinzufügen"
      />,
    );

    expect(
      screen.getByRole("link", { name: "Weiteren Abschnitt hinzufügen" }),
    ).toHaveAttribute("href", "/abschnitt-hinzufuegen");
  });

  it("renders additional content before the link", () => {
    const { container } = render(
      <AddArrayItemButton
        href="/abschnitt-hinzufuegen"
        buttonText="Weiteren Abschnitt hinzufügen"
        additionalContent={<p>Vorhandener Abschnitt</p>}
      />,
    );

    const content = screen.getByText("Vorhandener Abschnitt");
    const link = screen.getByRole("link", {
      name: "Weiteren Abschnitt hinzufügen",
    });

    expect(container.querySelector("div")?.firstElementChild).toBe(content);
    expect(link).toBeInTheDocument();
  });

  it("marks the link as disabled and removes its href when disabled", () => {
    render(
      <AddArrayItemButton
        href="/abschnitt-hinzufuegen"
        buttonText="Weiteren Abschnitt hinzufügen"
        disabled
        dataTestId="disabled-link"
      />,
    );

    const link = screen.getByTestId("disabled-link");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
  });

  it("uses a custom test ID when provided", () => {
    render(
      <AddArrayItemButton
        href="/abschnitt-hinzufuegen"
        buttonText="Weiteren Abschnitt hinzufügen"
        dataTestId="add-another-section"
      />,
    );

    expect(screen.getByTestId("add-another-section")).toBeInTheDocument();
  });
});
