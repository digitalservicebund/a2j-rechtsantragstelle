import { type Meta, type StoryObj } from "@storybook/react-vite";
import TableOfContents from "~/components/formElements/TableOfContents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "components/TableOfContents",
  component: TableOfContents,
  tags: ["autodocs"],
} satisfies Meta<typeof TableOfContents>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  label: {
    text: "Table of Contents Label",
    tagName: "p",
  } as const,
  links: [
    { text: "Table of Contents Link 1", url: "#first-link" },
    { text: "Table of Contents Link 2", url: "#second-link" },
    { text: "Table of Contents Link 3", url: "#third-link" },
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
