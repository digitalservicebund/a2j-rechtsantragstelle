import type { Meta, StoryObj } from "@storybook/react";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";
import TileGroup from "~/components/formElements/tile/TileGroup";
import Container from "~/components/layout/Container";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "FormElements/TileGroup",
  component: TileGroup,
  parameters: {
    controls: {
      exclude: ["title", "name"],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => <Container>{reactRouterFormContext(<Story />)}</Container>,
  ],
} satisfies Meta<typeof TileGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const tileGroupOptionOneProps = {
  value: "value1",
  description: "Some random description",
  title: "Some random title",
};

const tileGroupOptionTwoProps = {
  value: "value2",
  description: "Some random description",
  title: "Some random title",
};

const tileGroupProps = {
  title: "tileTile",
  name: "tileName",
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
