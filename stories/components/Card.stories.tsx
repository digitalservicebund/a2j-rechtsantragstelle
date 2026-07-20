import { type Meta, type StoryObj } from "@storybook/react-vite";
import Card from "~/components/content/card/Card";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    heading: "Card heading",
    title: "Card Title",
    description: "Card description",
    buttonLabel: "Button Text",
  },
};
