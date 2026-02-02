import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import KernTile from "~/components/kern/formElements/tile/KernTile";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "kern/formElements/KernTile",
  component: KernTile,
  parameters: {
    controls: {
      exclude: ["title", "name"],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <GridSection>
          <Grid>
            <GridItem>
              <Story />
            </GridItem>
          </Grid>
        </GridSection>,
      ),
  ],
} satisfies Meta<typeof KernTile>;

export default meta;

type Story = StoryObj<typeof meta>;

const tileGroupOptionOneProps = {
  value: "value1",
  description: "Kachelbeschreibung",
  title: "Kacheltitel",
};

const tileGroupOptionTwoProps = {
  value: "value2",
  description: "Kachelbeschreibung",
  title: "Kacheltitel",
};

const tileGroupProps = {
  title: "Kacheltitel",
  name: "Kachelname",
  errorMessages: undefined,
  options: [tileGroupOptionOneProps, tileGroupOptionTwoProps],
  useTwoColumns: false,
};

const imgUrl1 = bucketUrl + "/nichtbefoerderung_622132fec8.svg";
const imgUrl2 = bucketUrl + "/verspaetung_3a4c9932b4.svg";

export const TextOnly: Story = {
  args: { ...tileGroupProps },
};

export const WithImageAndTag: Story = {
  args: {
    ...tileGroupProps,
    options: [
      {
        ...tileGroupOptionOneProps,
      },
      {
        ...tileGroupOptionOneProps,
        image: { url: imgUrl1 },
      },
      {
        ...tileGroupOptionOneProps,
        image: { url: imgUrl1 },
      },
      {
        ...tileGroupOptionTwoProps,
        image: { url: imgUrl2 },
        tagDescription: "Tag description",
      },
    ],
  },
};
