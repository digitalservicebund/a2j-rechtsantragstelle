import type { Meta, StoryObj } from "@storybook/react-vite";
import { StandaloneLink } from "../app/components/common/StandaloneLink";
import { reactRouterContext } from "../.storybook/reactRouterContext";
import SignLanguage from "@digitalservicebund/icons/SignLanguage";

const component = StandaloneLink;

const meta = {
  title: "Common/StandaloneLink",
  component: component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof component>;

export const Default = {
  args: {
    text: "External Link",
    url: "https://www.google.com",
  },
  decorators: [(Story) => reactRouterContext(Story)],
} satisfies StoryObj<typeof meta>;

export const InternalLeftIcon = {
  args: {
    text: "Internal Link with Left Icon",
    url: "/home",
    icon: SignLanguage({
      height: "1.2em",
      width: "1.2em",
      style: {
        display: "inline-block",
        marginRight: "0.2em",
        marginBottom: "4px",
      },
    }),
  },
  decorators: [(Story) => reactRouterContext(Story)],
} satisfies StoryObj<typeof meta>;

export default meta;
