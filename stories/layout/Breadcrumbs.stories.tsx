import type { Meta, StoryObj } from "@storybook/react-vite";
import Breadcrumbs from "~/components/layout/Breadcrumbs";

const meta = {
  title: "layout/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  heading: {
    text: "Hero Heading",
    tagName: "h1",
    look: "default",
  } as const,
};

export const Default: Story = {
  decorators: [(Story) => <Story />],
  args: {
    ...defaultArgs,
    breadcrumbs: [
      { url: "/beratungshilfe", title: "Beratungshilfe" },
      { url: "/beratungshilfe/vorabcheck", title: "Vorab-Check" },
    ],
  },
};
