import type { Meta, StoryObj } from "@storybook/react-vite";
import KernFooter from "~/components/kern/layout/footer/KernFooter";
import { GridSection } from "~/components/layout/grid/GridSection";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "kern/layout/KernFooter",
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
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "Bundesministerium der Justiz",
    },
    showDeletionBanner: false,
  },
};

export const WithDeletionBanner: Story = {
  args: {
    ...Default.args,
    showDeletionBanner: true,
  },
};
