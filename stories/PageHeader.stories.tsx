import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "~/components/PageHeader";

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
  },
} satisfies StoryObj<typeof meta>;

export const FlowPage = {
  args: {
    title: "Justiz-Services",
    linkLabel: "Justiz-Services",
    hideHeaderLinks: true,
  },
} satisfies StoryObj<typeof meta>;

export default meta;
