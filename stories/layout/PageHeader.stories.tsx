import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterContext } from "~/../.storybook/reactRouterContext";
import PageHeader from "~/components/layout/PageHeader";

const meta = {
  title: "layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [(Story) => reactRouterContext(Story)],
} satisfies Meta<typeof PageHeader>;

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
