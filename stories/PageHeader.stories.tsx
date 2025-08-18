import { reactRouterContext } from ".storybook/reactRouterContext";
import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "~/components/common/PageHeader";

const component = PageHeader;

const meta = {
  title: "Component/PageHeader",
  component: component,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof component>;

export const Default = {
  args: {
    title: "Justiz-Services",
    linkLabel: "Justiz-Services",
    hideLinks: false,
  },
  decorators: [(Story) => reactRouterContext(() => <Story />)],
} satisfies StoryObj<typeof meta>;

export const FlowPage = {
  args: {
    title: "Justiz-Services",
    linkLabel: "Justiz-Services",
    hideLinks: true,
  },
  decorators: [(Story) => reactRouterContext(() => <Story />)],
} satisfies StoryObj<typeof meta>;

export default meta;
