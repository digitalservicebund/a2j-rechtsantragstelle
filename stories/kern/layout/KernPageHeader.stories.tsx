import type { Meta, StoryObj } from "@storybook/react-vite";
import KernPageHeader from "~/components/kern/layout/KernPageHeader";
import { reactRouterContext } from ".storybook/reactRouterContext";

const meta = {
  title: "kern/layout/KernPageHeader",
  component: KernPageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [(Story) => reactRouterContext(Story)],
} satisfies Meta<typeof KernPageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Justiz-Services",
    linkLabel: "Startseite",
    hideLinks: false,
  },
};

export const WithoutLinks: Story = {
  args: {
    title: "Justiz-Services",
    linkLabel: "Startseite",
    hideLinks: true,
  },
};
