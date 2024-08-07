import type { Meta, StoryObj } from "@storybook/react";
import { StandaloneLink } from "../app/components/StandaloneLink";
import { remixContext } from "../.storybook/remixContext";
const component = StandaloneLink;

const meta = {
  title: "Component/StandaloneLink",
  component: component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof component>;

export const Default = {
  args: {
    text: "External Link",
    url: "https://www.google.com",
  },
  decorators: [(Story) => remixContext(Story)],
} satisfies StoryObj<typeof meta>;
export default meta;
