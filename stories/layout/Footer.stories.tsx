import type { Meta, StoryObj } from "@storybook/react-vite";
import Footer from "~/components/layout/footer/Footer";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "layout/Footer",
  component: Footer,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Story />
      </GridSection>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showDeletionBanner: false,
  },
};

export const WithDeletionBanner: Story = {
  args: {
    ...Default.args,
    showDeletionBanner: true,
  },
};
