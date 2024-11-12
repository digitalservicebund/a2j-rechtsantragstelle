import { remixContext } from ".storybook/remixContext";
import type { Meta, StoryObj } from "@storybook/react";
import { SkipToContentLink } from "~/components/navigation/SkipToContentLink";

const meta = {
  title: "Component/SkipToContentLink",
  component: SkipToContentLink,
  tags: ["autodocs"],
} satisfies Meta<typeof SkipToContentLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Zum Hauptinhalt springen",
    target: "#main",
  },
  decorators: [(Story) => remixContext(Story)],
};
