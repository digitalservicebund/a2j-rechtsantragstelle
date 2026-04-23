import type { Meta, StoryObj } from "@storybook/react-vite";
import KernVideo from "~/components/kern/video/KernVideo";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "components/Video",
  component: KernVideo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof KernVideo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Erklärungsvideo: Wie funktioniert Beratungshilfe?",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
};
