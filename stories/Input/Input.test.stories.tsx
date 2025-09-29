import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { reactRouterFormContext } from "../../.storybook/reactRouterFormContext";
import Input from "../../app/components/formElements/Input";
import z from "zod";

const inputErrorSchemaTest = z.object({
  input: z
    .string()
    .min(1, "This field is required")
    .min(5, "Minimum 5 characters required"),
});

const meta = {
  title: "Testing/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["snapshot", "interaction", "accessibility"],
  decorators: [
    (Story) => (
      <main>{reactRouterFormContext(<Story />, inputErrorSchemaTest)}</main>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAccessibility: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    type: "text",
    placeholder: "placeholder",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: /lorem ipsum dolor sit amet/i,
    });
    const label = canvas.getByText("Lorem ipsum dolor sit amet");

    await expect(input).toHaveAccessibleName("Lorem ipsum dolor sit amet");
    await expect(label).toBeInTheDocument();
  },
};

export const WithHelperTextAccessibility: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    helperText: "Helper",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: /lorem ipsum dolor sit amet/i,
    });
    const helperText = canvas.getByText("Helper");

    await expect(helperText).toBeInTheDocument();
    await expect(input).toHaveAttribute("aria-describedby");
  },
};

export const WithPrefixAccessibility: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    prefix: "€",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: /lorem ipsum dolor sit amet/i,
    });
    const prefix = canvas.getByText("€");

    await expect(prefix).toBeInTheDocument();
    await expect(input).toHaveAccessibleName("Lorem ipsum dolor sit amet");
  },
};

export const WithSuffixAccessibility: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    suffix: "€",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: /lorem ipsum dolor sit amet/i,
    });

    await expect(input).toHaveAccessibleName("Lorem ipsum dolor sit amet");
  },
};

export const InputFocusAccessibility: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    type: "text",
    placeholder: "placeholder",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: /lorem ipsum dolor sit amet/i,
    });

    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};

export const TextInputInteraction: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    type: "text",
    placeholder: "placeholder",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: /lorem ipsum dolor sit amet/i,
    });

    await userEvent.type(input, "Hello World");
    await expect(input).toHaveValue("Hello World");

    await userEvent.clear(input);
    await expect(input).toHaveValue("");
  },
};

export const WithHelperTextInteraction: Story = {
  args: {
    name: "input",
    label: "Lorem ipsum dolor sit amet",
    helperText: "Helper",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: /lorem ipsum dolor sit amet/i,
    });
    const helperText = canvas.getByText("Helper");

    await expect(helperText).toBeInTheDocument();

    await userEvent.type(input, "Test with helper");
    await expect(input).toHaveValue("Test with helper");
  },
};

export const WithErrorInteraction: Story = {
  args: {
    name: "input",
    label: "Your input",
    type: "text",
    placeholder: "Enter text here",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByLabelText("Your input");

    await userEvent.click(input);
    await userEvent.tab();

    const requiredError = await canvas.findByText("This field is required");
    await expect(requiredError).toBeInTheDocument();
    await expect(input).toHaveAttribute("aria-invalid", "true");

    await userEvent.type(input, "abc");
    await userEvent.tab();
    const minLengthError = await canvas.findByText(
      "Minimum 5 characters required",
    );
    await expect(minLengthError).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, "abcdef");
    await userEvent.tab();
    await expect(
      canvas.queryByText("Minimum 5 characters required"),
    ).not.toBeInTheDocument();
    await expect(input).toHaveAttribute("aria-invalid", "false");
  },
};
