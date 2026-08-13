import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "~/components/common/Badge";

const variants = ["info", "success", "warning", "danger"] as const;

const meta = {
  title: "components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [undefined, ...variants],
    },
    icon: {
      control: "select",
      options: [undefined, "group", "info", "check-circle", "warning"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Kind von Maria",
    icon: "group",
  },
};

export const AllVariants: Story = {
  args: { children: "Badge" },
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Badge icon="group">Default</Badge>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
