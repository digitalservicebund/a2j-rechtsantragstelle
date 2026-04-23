import type { Meta, StoryObj } from "@storybook/react-vite";
import Image from "~/components/common/Image";
import bmjLogo from "../assets/bmj_logo.png";
import rechtlicheUntRaw from "../assets/Rechtliche_Unterstuetzung.svg?raw";

const meta = {
  title: "components/Image",
  component: Image,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithUrl: Story = {
  args: {
    url: bmjLogo,
    alternativeText: "BMJ Logo",
    width: 200,
  },
};

export const Decorative: Story = {
  args: {
    url: bmjLogo,
    ariaHidden: true,
    width: 200,
  },
};

export const WithInlineSvg: Story = {
  args: {
    svgString: rechtlicheUntRaw,
    alternativeText: "Rechtliche Unterstützung",
    width: 200,
  },
};
