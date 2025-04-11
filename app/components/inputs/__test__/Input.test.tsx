import { render, screen } from "@testing-library/react";
import type { InputProps } from "../Input";
import Input from "../Input";

vi.mock("@rvf/remix", () => ({
  useField: () => ({
    getInputProps: vi.fn().mockReturnValue({
      id: "inputId",
      placeholder: "Any placeholder",
    }),
    error: vi.fn(),
  }),
}));

describe("Input", () => {
  const cases = [
    { widthProps: "3", expectedClassWidth: "max-w-[9ch]" },
    { widthProps: "5", expectedClassWidth: "max-w-[11ch]" },
    { widthProps: "7", expectedClassWidth: "max-w-[13ch]" },
    { widthProps: "10", expectedClassWidth: "max-w-[16ch]" },
    { widthProps: "16", expectedClassWidth: "max-w-[22ch]" },
    { widthProps: "24", expectedClassWidth: "max-w-[30ch]" },
    {
      widthProps: "36",
      expectedClassWidth: "max-w-[42ch]",
    },
    {
      widthProps: "54",
      expectedClassWidth: "max-w-[60ch]",
    },
  ];

  test.each(cases)(
    "should render Input component with width $expectedClassWidth given props width with the value $widthProps",
    ({ widthProps, expectedClassWidth }) => {
      const { container } = render(
        <Input
          name="input"
          width={widthProps as InputProps["width"]}
          label="Test Label"
        />,
      );

      expect(container.querySelector("#inputId")).toHaveClass(
        expectedClassWidth,
      );
    },
  );

  describe("Input field with helper text", () => {
    test("Displays helper text if provided", () => {
      render(
        <Input
          name="input"
          width="54"
          label="Test Label"
          helperText="Test Helper Text"
        />,
      );
      expect(screen.getByText("Test Helper Text")).toBeInTheDocument();
    });
  });
  describe("Input field with aria-required attribute", () => {
    it("has aria-required attribute set to true if errorMessages contain inputRequired", () => {
      render(
        <Input
          name="test"
          errorMessages={[
            { code: "required", text: "error" },
            {
              code: "invalid",
              text: "Bitte geben Sie eine gültige Uhrzeit ein.",
            },
          ]}
        />,
      );
      const element = screen.getByRole("textbox");
      expect(element).toHaveAttribute("aria-required", "true");
    });

    it("has aria-required attribute set to false if errorMessages do not contain inputRequired", () => {
      render(<Input name="test" errorMessages={undefined} />);
      const element = screen.getByRole("textbox");
      expect(element).toHaveAttribute("aria-required", "false");
    });
  });
});
