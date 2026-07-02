import { type StoryObj, type Meta } from "@storybook/react-vite";
import Table from "~/components/content/Table";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "components/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid
          background={{
            mdColumn: { start: 1, span: 8 },
            lgColumn: { start: 2, span: 10 },
            xlColumn: { start: 2, span: 10 },
          }}
        >
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: { text: "Table Heading" },
    description: "Table Description",
    title: "Table Title",
    columns: [
      {
        id: 1,
        header: "Column Header",
      },
      {
        id: 2,
        header: "Column Header",
      },
      {
        id: 3,
        header: "Column Header",
      },
    ],
    rows: [
      {
        id: 1,
        cells: [
          { id: 1, header: "Row Header", content: "Row Header 1" },
          { id: 2, header: "Row Header", content: "Row Data" },
          { id: 3, header: "Row Header", content: "Row Data" },
        ],
      },
      {
        id: 2,
        cells: [
          { id: 4, header: "Row Header", content: "Row Header 2" },
          { id: 5, header: "Row Header", content: "Row Data" },
          { id: 6, header: "Row Header", content: "Row Data" },
        ],
      },
      {
        id: 3,
        cells: [
          { id: 7, header: "Row Header", content: "Row Header 3" },
          { id: 8, header: "Row Header", content: "Row Data" },
          { id: 9, header: "Row Header", content: "Row Data" },
        ],
      },
    ],
  },
};
