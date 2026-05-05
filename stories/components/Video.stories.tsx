import type { Meta, StoryObj } from "@storybook/react-vite";
import Video from "~/components/content/video/Video";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "components/Video",
  component: Video,
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
} satisfies Meta<typeof Video>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Erklärungsvideo: Wie funktioniert Beratungshilfe?",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
};
