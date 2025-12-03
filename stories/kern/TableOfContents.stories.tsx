import { Meta, StoryObj } from "@storybook/react-vite";
import TableOfContents from "~/components/content/TableOfContents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/TableOfContents",
  component: TableOfContents,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TableOfContents>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  heading: {
    text: "Table of Contents Heading",
    tagName: "h1",
    look: "ds-heading-01-reg",
  } as const,
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
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
};
