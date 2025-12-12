import {type Meta, StoryObj } from "@storybook/react-vite";
import KernTableOfContents from "~/components/kern/KernTableOfContents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/TableOfContents",
  component: KernTableOfContents,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernTableOfContents>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  label: {
    text: "Table of Contents Label",
    tagName: "p",
    look: "ds-label-02-reg",
  } as const,
  links: [
    { text: "First Link", url: "#first-link" },
    { text: "Second Link", url: "#second-link" },
    { text: "Third Link", url: "#third-link" },
  ],
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem>
            <Story />
          </GridItem>
        </Grid>
      </GridSection>
    ),
  ],
};
