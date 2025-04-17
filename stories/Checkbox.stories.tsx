import type { StoryObj } from "@storybook/react";
import Checkbox from "../app/components/inputs/Checkbox";
import { RFCFormerProvider } from "../.storybook/RFCFormerProvider";
import { reactRouterContext } from ".storybook/reactRouterContext";

const meta = {
  title: "Component/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    name: "name",
    label: "label",
  },
  decorators: [
    (Story) =>
      reactRouterContext(() => (
        <RFCFormerProvider>
          <Story />
        </RFCFormerProvider>
      )),
  ],
} satisfies StoryObj<typeof meta>;
export default meta;
