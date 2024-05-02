import type { Meta, StoryObj } from "@storybook/react";
import { remixContext } from "../.storybook/remixContext";
import TileGroup from "~/components/inputs/tile/TileGroup";

const meta = {
  title: "Component/TileGroup",
  component: TileGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
  showRadioButtonTiles: false,
  formId: "formId",
};

export const TileWithoutRadioButtonsOneColumn: Story = {
  args: {
    ...tileGroupProps,
  },
  decorators: [(Story) => remixContext(Story)],
};

export const TileWithoutRadioButtonsTwoColumns: Story = {
  args: {
    ...tileGroupProps,
    useTwoColumns: true,
  },
  decorators: [(Story) => remixContext(Story)],
};

export const TileWithtoutRadioButtonsTwoColumnAndImageOption: Story = {
  args: {
    ...tileGroupProps,
    useTwoColumns: true,
    options: [
      {
        ...tileGroupOptionOneProps,
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/nichtbefoerderung_622132fec8.svg",
        },
      },
      {
        ...tileGroupOptionTwoProps,
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/verspaetung_3a4c9932b4.svg",
        },
      },
    ],
  },
  decorators: [(Story) => remixContext(Story)],
};

export const TileWithoutRadioButtonsTwoColumnAndImageOptionAndTag: Story = {
  args: {
    ...tileGroupProps,
    useTwoColumns: true,
    options: [
      {
        ...tileGroupOptionOneProps,
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/nichtbefoerderung_622132fec8.svg",
        },
      },
      {
        ...tileGroupOptionTwoProps,
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/verspaetung_3a4c9932b4.svg",
        },
        tagDescription: "Tag description",
      },
    ],
  },
  decorators: [(Story) => remixContext(Story)],
};

export const TileWithtRadioButtonsOneColumn: Story = {
  args: {
    ...tileGroupProps,
    showRadioButtonTiles: true,
  },
  decorators: [(Story) => remixContext(Story)],
};

export const TileWithtRadioButtonsTwoColumn: Story = {
  args: {
    ...tileGroupProps,
    useTwoColumns: true,
    showRadioButtonTiles: true,
  },
  decorators: [(Story) => remixContext(Story)],
};

export const TileWithtRadioButtonsTwoColumnAndImageOption: Story = {
  args: {
    ...tileGroupProps,
    useTwoColumns: true,
    showRadioButtonTiles: true,
    options: [
      {
        ...tileGroupOptionOneProps,
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/nichtbefoerderung_622132fec8.svg",
        },
      },
      {
        ...tileGroupOptionTwoProps,
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/verspaetung_3a4c9932b4.svg",
        },
      },
    ],
  },
  decorators: [(Story) => remixContext(Story)],
};

export const TileWithtRadioButtonsTwoColumnAndImageOptionAndTag: Story = {
  args: {
    ...tileGroupProps,
    useTwoColumns: true,
    showRadioButtonTiles: true,
    options: [
      {
        ...tileGroupOptionOneProps,
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/nichtbefoerderung_622132fec8.svg",
        },
      },
      {
        ...tileGroupOptionTwoProps,
        image: {
          url: "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com/verspaetung_3a4c9932b4.svg",
        },
        tagDescription: "Tag description",
      },
    ],
  },
  decorators: [(Story) => remixContext(Story)],
};
