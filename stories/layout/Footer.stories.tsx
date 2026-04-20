import type { Meta, StoryObj } from "@storybook/react-vite";
import KernFooter from "~/components/kern/layout/footer/KernFooter";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "layout/Footer",
  component: KernFooter,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Story />
      </GridSection>
    ),
  ],
} satisfies Meta<typeof KernFooter>;

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
